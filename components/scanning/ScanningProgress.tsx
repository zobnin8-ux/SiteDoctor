"use client";

import { ScanningFocal } from "@/components/scanning/ScanningFocal";
import { StepsList } from "@/components/scanning/StepsList";
import { ProgressBar } from "@/components/scanning/ProgressBar";

const STEPS = [
  "Открываем главную страницу",
  "Сканируем мобильную версию",
  "Анализируем тексты и призывы",
  "Проверяем сигналы доверия",
  "Формируем диагноз",
] as const;

type Props = {
  completedSteps: number;
  progress: number;
  hostLabel: string;
};

export function ScanningProgress({
  completedSteps,
  progress,
  hostLabel,
}: Props) {
  return (
    <div className="flex w-full max-w-md flex-col items-center text-center">
      <ScanningFocal />

      <p className="mt-6 font-mono-data text-xs font-medium uppercase tracking-[0.2em] text-[var(--accent-primary)]">
        WEBSITE X-RAY
      </p>
      <p className="mt-2 font-display text-lg font-semibold text-[var(--text-primary)] sm:text-xl">
        Анализируем {hostLabel}…
      </p>

      <StepsList steps={STEPS} completedSteps={completedSteps} />

      <ProgressBar value={progress} className="mt-8" />

      <p className="mt-8 text-xs leading-relaxed text-[var(--text-muted)] sm:text-sm">
        Обычно занимает 30–60 секунд. Не закрывайте страницу.
      </p>
    </div>
  );
}
