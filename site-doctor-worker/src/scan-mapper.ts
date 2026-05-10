import type { PageData } from "./ai-prompt.js";
import type { ScanResultV1 } from "./scan-result.js";

export function pageDataFromScanSuccess(
  sr: Extract<ScanResultV1, { status: "success" }>,
  url: string
): PageData {
  const desk = sr.desktop;
  const mob = sr.mobile;
  const h1Desk =
    desk.h1?.length && desk.h1.length > 0 ? desk.h1.join(" · ") : undefined;
  const h1Mob =
    mob.h1?.length && mob.h1.length > 0 ? mob.h1.join(" · ") : undefined;

  return {
    url,
    desktop: {
      title: desk.title,
      description: desk.description ?? undefined,
      h1: h1Desk,
      body_words: desk.word_count,
      forms_count: desk.form_count,
    },
    mobile: {
      title: mob.title,
      description: mob.description ?? undefined,
      h1: h1Mob,
      body_words: mob.word_count,
      forms_count: mob.form_count,
    },
    trust_notes: sr.trust_notes,
    screenshots: {
      desktop: sr.desktop_screenshot_url ?? undefined,
      mobile: sr.mobile_screenshot_url ?? undefined,
    },
  };
}
