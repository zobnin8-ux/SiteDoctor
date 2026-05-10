import { supabase } from "./supabase.js";
import type { Scan } from "./types.js";

interface Step {
  status: "scanning" | "analyzing";
  step: string;
  progress: number;
  delayMs: number;
}

const SIMULATED_STEPS: Step[] = [
  { status: "scanning", step: "Открываем главную страницу", progress: 15, delayMs: 1500 },
  { status: "scanning", step: "Сканируем мобильную версию", progress: 35, delayMs: 2000 },
  { status: "analyzing", step: "Анализируем тексты и призывы", progress: 55, delayMs: 2500 },
  { status: "analyzing", step: "Проверяем сигналы доверия", progress: 75, delayMs: 2000 },
  { status: "analyzing", step: "Формируем диагноз", progress: 95, delayMs: 2000 },
];

export async function processScan(scan: Scan): Promise<void> {
  console.log(`[${scan.id}] Processing scan for ${scan.url}`);

  try {
    // Стартуем
    await supabase
      .from("scans")
      .update({
        status: "scanning",
        started_at: new Date().toISOString(),
        progress: 5,
        current_step: SIMULATED_STEPS[0].step,
      })
      .eq("id", scan.id);

    // Идём по шагам с задержками
    for (const step of SIMULATED_STEPS) {
      await sleep(step.delayMs);

      const { error } = await supabase
        .from("scans")
        .update({
          status: step.status,
          progress: step.progress,
          current_step: step.step,
        })
        .eq("id", scan.id);

      if (error) {
        console.error(`[${scan.id}] Failed to update progress:`, error);
        throw error;
      }

      console.log(`[${scan.id}] ${step.progress}% — ${step.step}`);
    }

    // Финал
    await sleep(800);

    await supabase
      .from("scans")
      .update({
        status: "ready",
        progress: 100,
        current_step: "Готово",
        completed_at: new Date().toISOString(),
      })
      .eq("id", scan.id);

    console.log(`[${scan.id}] ✅ Done`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[${scan.id}] ❌ Failed:`, message);

    await supabase
      .from("scans")
      .update({
        status: "failed",
        error_message: message,
        completed_at: new Date().toISOString(),
      })
      .eq("id", scan.id);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
