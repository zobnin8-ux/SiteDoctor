/** Порядок шагов должен совпадать с воркером (`site-doctor-worker/src/processor.ts`). */
export const SCAN_STEP_ORDER = [
  "В очереди",
  "Открываем главную страницу",
  "Сканируем мобильную версию",
  "Анализируем тексты и призывы",
  "Проверяем сигналы доверия",
  "Формируем диагноз",
] as const;

export const SCAN_STEPS_UI = SCAN_STEP_ORDER.slice(1);

export type ScanStatusDb =
  | "pending"
  | "scanning"
  | "analyzing"
  | "ready"
  | "failed";

/** Нормализация `error_message` из БД для показа пользователю. */
export function scanErrorMessageForUi(raw: string | null | undefined): string {
  if (!raw || raw.trim() === "" || raw === "[object Object]") {
    return "Ошибка на сервере. Проверьте настройки Supabase или попробуйте позже.";
  }
  return raw;
}

/** Значение `completedSteps` для `StepsList`: сколько шагов из списка уже пройдено (анимация ✓/⏳). */
export function scanToCompletedSteps(
  currentStep: string | null,
  status: ScanStatusDb
): number {
  if (status === "ready") return SCAN_STEPS_UI.length;
  if (!currentStep || currentStep === "В очереди") return 0;
  if (currentStep === "Готово") return SCAN_STEPS_UI.length;

  const idx = SCAN_STEPS_UI.findIndex((s) => s === currentStep);
  if (idx === -1) return 0;
  return idx;
}
