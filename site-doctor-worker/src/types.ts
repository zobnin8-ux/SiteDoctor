import type { ScanResultV1 } from "./scan-result.js";

export type ScanStatus = "pending" | "scanning" | "analyzing" | "ready" | "failed";

export interface Scan {
  id: string;
  url: string;
  normalized_url: string;
  status: ScanStatus;
  progress: number;
  current_step: string | null;
  error_message: string | null;
  ip_address: string | null;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
  /** Заполняется воркером после скана (этап A). */
  scan_result?: ScanResultV1 | null;
  desktop_screenshot_url?: string | null;
  mobile_screenshot_url?: string | null;
}
