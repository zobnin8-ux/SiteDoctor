import type { PlaywrightScanResult, ScanPageSnapshot } from "./playwright-scan.js";

export const SCAN_RESULT_VERSION = 1 as const;

/** Снимок страницы в JSON для БД (snake_case). */
export type ScanResultSnapshotJson = {
  final_url: string;
  title: string;
  description: string | null;
  h1: string[];
  word_count: number;
  form_count: number;
  contact_link_count: number;
};

export type ScanResultV1 =
  | {
      version: typeof SCAN_RESULT_VERSION;
      status: "success";
      scanned_at: string;
      input_url: string;
      desktop: ScanResultSnapshotJson;
      mobile: ScanResultSnapshotJson;
      trust_notes: string[];
      desktop_screenshot_url?: string | null;
      mobile_screenshot_url?: string | null;
    }
  | {
      version: typeof SCAN_RESULT_VERSION;
      status: "failed";
      scanned_at: string;
      input_url: string;
      error: { message: string };
    };

function snapshotToJson(s: ScanPageSnapshot): ScanResultSnapshotJson {
  return {
    final_url: s.finalUrl,
    title: s.title,
    description: s.description,
    h1: s.h1,
    word_count: s.wordCount,
    form_count: s.formCount,
    contact_link_count: s.contactLinkCount,
  };
}

export function buildScanResultSuccess(
  inputUrl: string,
  result: PlaywrightScanResult,
  screenshotUrls?: { desktopUrl: string | null; mobileUrl: string | null }
): ScanResultV1 {
  return {
    version: SCAN_RESULT_VERSION,
    status: "success",
    scanned_at: new Date().toISOString(),
    input_url: inputUrl,
    desktop: snapshotToJson(result.desktop),
    mobile: snapshotToJson(result.mobile),
    trust_notes: result.trustNotes,
    desktop_screenshot_url: screenshotUrls?.desktopUrl ?? null,
    mobile_screenshot_url: screenshotUrls?.mobileUrl ?? null,
  };
}

export function buildScanResultFailed(inputUrl: string, message: string): ScanResultV1 {
  return {
    version: SCAN_RESULT_VERSION,
    status: "failed",
    scanned_at: new Date().toISOString(),
    input_url: inputUrl,
    error: { message },
  };
}
