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
}
