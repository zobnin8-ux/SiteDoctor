import { formatError } from "./errors.js";
import { supabase } from "./supabase.js";
import { runPlaywrightScan } from "./playwright-scan.js";
import { buildScanResultFailed, buildScanResultSuccess } from "./scan-result.js";
import type { Scan } from "./types.js";

export async function processScan(scan: Scan): Promise<void> {
  const targetUrl = scan.normalized_url?.trim() || scan.url;
  console.log(`[${scan.id}] Processing scan for ${targetUrl}`);

  try {
    const { error: startErr } = await supabase
      .from("scans")
      .update({
        status: "scanning",
        started_at: new Date().toISOString(),
        progress: 5,
        current_step: "Открываем главную страницу",
      })
      .eq("id", scan.id);

    if (startErr) {
      console.error(`[${scan.id}] Failed to start scan row:`, startErr);
      throw startErr;
    }

    const pushProgress = async (patch: {
      status: "scanning" | "analyzing";
      step: string;
      progress: number;
    }) => {
      const { error } = await supabase
        .from("scans")
        .update({
          status: patch.status,
          progress: patch.progress,
          current_step: patch.step,
        })
        .eq("id", scan.id);
      if (error) {
        console.error(`[${scan.id}] Failed to update progress:`, error);
        throw error;
      }
      console.log(`[${scan.id}] ${patch.progress}% — ${patch.step}`);
    };

    const result = await runPlaywrightScan(targetUrl, pushProgress);

    const summary = [
      `Desktop title: ${result.desktop.title.slice(0, 120)}`,
      `Mobile title: ${result.mobile.title.slice(0, 120)}`,
      `Слов (desktop ~body): ${result.desktop.wordCount}`,
      `Слов (mobile ~body): ${result.mobile.wordCount}`,
      `Формы: desktop ${result.desktop.formCount}, mobile ${result.mobile.formCount}`,
      `Итог URL: ${result.desktop.finalUrl}`,
      "--- Сигналы ---",
      ...result.trustNotes.map((n) => `• ${n}`),
    ].join("\n");

    console.log(`[${scan.id}] Scan summary:\n${summary}`);

    const scanResult = buildScanResultSuccess(targetUrl, result);

    await supabase
      .from("scans")
      .update({
        status: "ready",
        progress: 100,
        current_step: "Готово",
        completed_at: new Date().toISOString(),
        scan_result: scanResult,
      })
      .eq("id", scan.id);

    console.log(`[${scan.id}] ✅ Done`);
  } catch (err) {
    const message = formatError(err);
    console.error(`[${scan.id}] ❌ Failed:`, message, err);

    const failedPayload = buildScanResultFailed(targetUrl, message);

    await supabase
      .from("scans")
      .update({
        status: "failed",
        error_message: message,
        completed_at: new Date().toISOString(),
        scan_result: failedPayload,
      })
      .eq("id", scan.id);
  }
}
