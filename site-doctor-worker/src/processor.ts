import {
  analyzeScan,
  type AiAnalyzerResult,
} from "./ai-analyzer.js";
import { formatError } from "./errors.js";
import { runPlaywrightScan } from "./playwright-scan.js";
import { pageDataFromScanSuccess } from "./scan-mapper.js";
import {
  buildScanResultFailed,
  buildScanResultSuccess,
  SCAN_RESULT_VERSION_V2,
  type ScanResultSuccessV2,
} from "./scan-result.js";
import { supabase } from "./supabase.js";
import { uploadScanScreenshots } from "./storage-screenshots.js";
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

    let desktopShotUrl: string | null = null;
    let mobileShotUrl: string | null = null;
    try {
      const urls = await uploadScanScreenshots(
        scan.id,
        result.screenshots.desktopPng,
        result.screenshots.mobilePng
      );
      desktopShotUrl = urls.desktopUrl;
      mobileShotUrl = urls.mobileUrl;
      console.log(`[${scan.id}] Screenshots uploaded`);
    } catch (uploadErr) {
      console.error(`[${scan.id}] Screenshot upload failed:`, uploadErr);
    }

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

    const scanBase = buildScanResultSuccess(targetUrl, result, {
      desktopUrl: desktopShotUrl,
      mobileUrl: mobileShotUrl,
    });

    await supabase
      .from("scans")
      .update({
        status: "analyzing",
        progress: 70,
        current_step: "Формируем диагноз",
      })
      .eq("id", scan.id);

    console.log(`[${scan.id}] Calling AI...`);

    /** Страховка: если fetch/SDK всё же зависнут, не держим строку в analyzing бесконечно. */
    const AI_PIPELINE_HARD_MS = 240_000;
    const aiResult = await Promise.race<AiAnalyzerResult>([
      analyzeScan(pageDataFromScanSuccess(scanBase, targetUrl)),
      new Promise<AiAnalyzerResult>((resolve) =>
        setTimeout(
          () =>
            resolve({
              ok: false,
              error: "Превышено время ожидания этапа AI (общий лимит)",
            }),
          AI_PIPELINE_HARD_MS
        )
      ),
    ]);

    const finalScanResult: ScanResultSuccessV2 = {
      ...scanBase,
      version: SCAN_RESULT_VERSION_V2,
      ai_failed: !aiResult.ok,
      ai_error: aiResult.ok ? null : (aiResult.error ?? "Unknown error"),
      ...(aiResult.ok && aiResult.analysis
        ? { ai_analysis: aiResult.analysis }
        : {}),
    };

    await supabase
      .from("scans")
      .update({
        status: "ready",
        progress: 100,
        current_step: "Готово",
        completed_at: new Date().toISOString(),
        scan_result: finalScanResult,
        desktop_screenshot_url: desktopShotUrl,
        mobile_screenshot_url: mobileShotUrl,
      })
      .eq("id", scan.id);

    if (aiResult.ok) {
      console.log(`[${scan.id}] ✅ Done with AI analysis`);
    } else {
      console.warn(`[${scan.id}] ⚠️ Done WITHOUT AI: ${aiResult.error}`);
    }
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
