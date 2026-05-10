/** Построение модели отчёта из строки `scans` + `scan_result` (воркер). */

export type DiagnosisStatus = "critical" | "warning" | "ok";

export type ScanResultSnapshot = {
  final_url: string;
  title: string;
  description: string | null;
  h1: string[];
  word_count: number;
  form_count: number;
  contact_link_count: number;
};

export type ScanResultSuccess = {
  version: number;
  status: "success";
  scanned_at: string;
  input_url: string;
  desktop: ScanResultSnapshot;
  mobile: ScanResultSnapshot;
  trust_notes: string[];
  desktop_screenshot_url?: string | null;
  mobile_screenshot_url?: string | null;
};

export type ReportViewModel = {
  hostname: string;
  completedLabel: string;
  desktopShot: string | null;
  mobileShot: string | null;
  score: number;
  scoreVerdict: string;
  diagnosis: { id: string; label: string; status: DiagnosisStatus }[];
  topIssues: {
    id: string;
    severity: "critical" | "warning";
    title: string;
    description: string;
  }[];
  sampleFix: { before: string; after: string };
};

function parseHostname(url: string): string {
  try {
    const u = new URL(url.startsWith("http") ? url : `https://${url}`);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return url.slice(0, 48);
  }
}

function formatRuDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10);
  return d.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function httpsOk(snapshot: ScanResultSnapshot): boolean {
  try {
    return new URL(snapshot.final_url).protocol === "https:";
  } catch {
    return false;
  }
}

function clampScore(n: number): number {
  return Math.max(14, Math.min(96, Math.round(n)));
}

function verdictForScore(score: number): string {
  if (score >= 75) return "Есть сильные стороны, точечные улучшения дадут заметный эффект";
  if (score >= 55) return "Есть заметные пробелы — стоит заняться приоритетными блоками";
  return "Есть критичные зоны внимания на главной странице";
}

function labelStatus(ok: boolean, warnIfFalse: boolean): DiagnosisStatus {
  if (ok) return "ok";
  return warnIfFalse ? "warning" : "critical";
}

export function buildReportViewModel(row: {
  url: string;
  completed_at: string | null;
  desktop_screenshot_url?: string | null;
  mobile_screenshot_url?: string | null;
  scan_result: unknown;
}): ReportViewModel | null {
  const sr = row.scan_result as ScanResultSuccess | null;
  if (!sr || sr.status !== "success" || sr.version !== 1) return null;

  const d = sr.desktop;
  const m = sr.mobile;
  const notes = sr.trust_notes ?? [];

  let score = 52;
  if (httpsOk(d)) score += 14;
  else score -= 12;

  if (d.description && d.description.trim().length > 0) score += 10;
  else score -= 8;

  if (d.h1.length === 1) score += 10;
  else if (d.h1.length === 0) score -= 14;
  else score -= 4;

  const contacts = d.contact_link_count + m.contact_link_count;
  if (contacts > 0) score += 6;

  if (d.form_count > 0 || m.form_count > 0) score += 6;

  const wc = Math.min(d.word_count, m.word_count);
  if (wc >= 120) score += 5;
  else if (wc < 40) score -= 6;

  score = clampScore(score);

  const diagnosis: ReportViewModel["diagnosis"] = [
    {
      id: "https",
      label: "HTTPS и безопасность входа",
      status: labelStatus(httpsOk(d), true),
    },
    {
      id: "meta",
      label: "Meta description для поиска",
      status: labelStatus(
        !!(d.description && d.description.trim().length > 0),
        true
      ),
    },
    {
      id: "h1",
      label: "Заголовок H1 и ясность темы",
      status:
        d.h1.length === 1 ? "ok" : d.h1.length === 0 ? "critical" : "warning",
    },
    {
      id: "contacts",
      label: "Контакты (телефон / email)",
      status: contacts > 0 ? "ok" : "warning",
    },
    {
      id: "forms",
      label: "Формы и заявки на главной",
      status: d.form_count + m.form_count > 0 ? "ok" : "warning",
    },
    {
      id: "content",
      label: "Объём полезного текста на главной",
      status: wc >= 120 ? "ok" : wc >= 60 ? "warning" : "critical",
    },
  ];

  const topIssues = notes.slice(0, 3).map((note, i) => {
    const lower = note.toLowerCase();
    const critical =
      lower.includes("без https") ||
      lower.includes("не найден h1") ||
      lower.includes("нет meta");
    return {
      id: `n-${i + 1}`,
      severity: critical ? ("critical" as const) : ("warning" as const),
      title:
        note.length > 72 ? `${note.slice(0, 69).trim()}…` : note,
      description: note,
    };
  });

  const sampleFix = buildSampleFix(d, notes);

  const hostname = parseHostname(row.url);
  const desktopShot =
    row.desktop_screenshot_url ?? sr.desktop_screenshot_url ?? null;
  const mobileShot =
    row.mobile_screenshot_url ?? sr.mobile_screenshot_url ?? null;

  return {
    hostname,
    completedLabel: formatRuDate(row.completed_at ?? sr.scanned_at),
    desktopShot,
    mobileShot,
    score,
    scoreVerdict: verdictForScore(score),
    diagnosis,
    topIssues,
    sampleFix,
  };
}

function buildSampleFix(
  desktop: ScanResultSnapshot,
  notes: string[]
): { before: string; after: string } {
  const title = desktop.title?.trim() || "Главная страница";
  const noDesc =
    !desktop.description?.trim() ||
    notes.some((n) => n.includes("Нет meta description"));
  const noH1 =
    desktop.h1.length === 0 ||
    notes.some((n) => n.includes("Не найден H1"));

  if (noDesc) {
    return {
      before: title,
      after: `${title} — кратко: услуга, город, следующий шаг (запись / звонок). Meta description 150–160 символов.`,
    };
  }
  if (noH1) {
    return {
      before: "Тема главной не выделена одним заголовком H1",
      after: "Один H1: кто вы и какую проблему решаете за одно предложение.",
    };
  }
  return {
    before: "Общие формулировки без следующего шага",
    after: "Чёткий заголовок + один основной CTA: что получит клиент после клика.",
  };
}
