import { chromium } from "playwright";

export type ScanStatusPhase = "scanning" | "analyzing";

export type ProgressPayload = {
  status: ScanStatusPhase;
  step: string;
  progress: number;
};

export type ScanPageSnapshot = {
  finalUrl: string;
  title: string;
  description: string | null;
  h1: string[];
  wordCount: number;
  formCount: number;
  contactLinkCount: number;
};

export type PlaywrightScanResult = {
  desktop: ScanPageSnapshot;
  mobile: ScanPageSnapshot;
  trustNotes: string[];
  /** PNG viewport screenshots (доказательство реального открытия страницы). */
  screenshots: {
    desktopPng: Buffer;
    mobilePng: Buffer;
  };
};

async function collectSnapshot(
  page: import("playwright").Page,
  targetUrl: string
): Promise<ScanPageSnapshot> {
  const response = await page.goto(targetUrl, {
    waitUntil: "domcontentloaded",
    timeout: 45_000,
  });
  if (!response) {
    throw new Error("Сервер не вернул ответ");
  }
  if (!response.ok() && response.status() >= 400) {
    throw new Error(`Страница ответила HTTP ${response.status()}`);
  }

  await page.waitForLoadState("load", { timeout: 15_000 }).catch(() => undefined);

  const title = (await page.title()).trim();
  const description =
    (await page.locator('meta[name="description"]').getAttribute("content"))?.trim() ?? null;
  const h1Raw = await page.locator("h1").allInnerTexts();
  const h1 = h1Raw.map((t) => t.trim()).filter(Boolean);

  const bodyText = await page.locator("body").innerText().catch(() => "");
  const slice = bodyText.slice(0, 80_000);
  const wordCount = slice.trim().split(/\s+/).filter(Boolean).length;

  const formCount = await page.locator("form").count();
  const contactLinkCount = await page
    .locator('a[href^="tel:"], a[href^="mailto:"]')
    .count();

  return {
    finalUrl: page.url(),
    title,
    description,
    h1,
    wordCount,
    formCount,
    contactLinkCount,
  };
}

function buildTrustNotes(d: ScanPageSnapshot, m: ScanPageSnapshot): string[] {
  const notes: string[] = [];
  let url: URL;
  try {
    url = new URL(d.finalUrl);
  } catch {
    notes.push("Не удалось разобрать итоговый URL после редиректов");
    return notes;
  }

  if (url.protocol === "https:") {
    notes.push("HTTPS включён");
  } else {
    notes.push("Сайт без HTTPS — для посетителей выглядит менее надёжно");
  }

  if (d.description && d.description.length > 0) {
    notes.push("Есть meta description");
  } else {
    notes.push("Нет meta description — хуже для сниппета в поиске");
  }

  const h1Count = d.h1.length;
  if (h1Count === 1) {
    notes.push("На десктопе один H1 — хорошая практика");
  } else if (h1Count === 0) {
    notes.push("Не найден H1 на главной — усложняет понимание темы страницы");
  } else {
    notes.push(`На десктопе несколько H1 (${h1Count}) — часто лучше оставить один главный`);
  }

  if (d.contactLinkCount + m.contactLinkCount > 0) {
    notes.push("Есть кликабельный телефон или email");
  }

  if (d.formCount > 0 || m.formCount > 0) {
    notes.push("На странице есть формы (заявка, подписка и т.п.)");
  }

  return notes;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Даём странице дорисоваться: сеть, шрифты, lazy-блоки (на десктопе чаще «белый» hero до загрузки). */
async function preparePageForScreenshot(
  page: import("playwright").Page
): Promise<void> {
  await page
    .waitForLoadState("networkidle", { timeout: 12_000 })
    .catch(() => undefined);
  await page.evaluate(async () => {
    try {
      await document.fonts?.ready;
    } catch {
      /* ignore */
    }
  });
  await page.evaluate(() => {
    window.scrollTo(0, Math.min(document.body.scrollHeight, 4000));
  });
  await delay(450);
  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });
  await delay(200);
}

/** Реальный скан: десктоп → мобильный контекст → короткий разбор сигналов. */
export async function runPlaywrightScan(
  url: string,
  onProgress: (p: ProgressPayload) => Promise<void>
): Promise<PlaywrightScanResult> {
  await onProgress({
    status: "scanning",
    step: "Открываем главную страницу",
    progress: 12,
  });

  const browser = await chromium.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
    ],
  });

  try {
    const desktopContext = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      locale: "ru-RU",
    });
    const desktopPage = await desktopContext.newPage();
    const desktop = await collectSnapshot(desktopPage, url);
    await preparePageForScreenshot(desktopPage);
    const desktopPng = Buffer.from(
      await desktopPage.screenshot({
        type: "png",
        fullPage: false,
        animations: "disabled",
      })
    );
    await desktopContext.close();

    await onProgress({
      status: "scanning",
      step: "Открываем главную страницу",
      progress: 22,
    });

    await onProgress({
      status: "scanning",
      step: "Сканируем мобильную версию",
      progress: 28,
    });

    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      locale: "ru-RU",
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    });
    const mobilePage = await mobileContext.newPage();
    const mobile = await collectSnapshot(mobilePage, url);
    await preparePageForScreenshot(mobilePage);
    const mobilePng = Buffer.from(
      await mobilePage.screenshot({
        type: "png",
        fullPage: false,
        animations: "disabled",
      })
    );
    await mobileContext.close();

    await onProgress({
      status: "scanning",
      step: "Сканируем мобильную версию",
      progress: 38,
    });

    await onProgress({
      status: "analyzing",
      step: "Анализируем тексты и призывы",
      progress: 52,
    });

    const trustNotes = buildTrustNotes(desktop, mobile);

    await onProgress({
      status: "analyzing",
      step: "Проверяем сигналы доверия",
      progress: 72,
    });

    await onProgress({
      status: "analyzing",
      step: "Формируем диагноз",
      progress: 90,
    });

    return {
      desktop,
      mobile,
      trustNotes,
      screenshots: { desktopPng, mobilePng },
    };
  } finally {
    await browser.close();
  }
}
