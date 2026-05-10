"use client";

import { ScoreNumber } from "@/components/shared/ScoreNumber";
import { SAMPLE_REPORT } from "@/lib/sample-report";

type SubScores = {
  trust: number;
  cta: number;
  clarity: number;
  mobile: number;
  visual: number;
};

type OverallScoreBlockProps = {
  score?: number;
  scoreVerdict?: string;
  /** Сабскоры AI (пять метрик без дублирования overall в сетке). */
  subScores?: SubScores;
};

const SUB_LABELS: { key: keyof SubScores; label: string }[] = [
  { key: "trust", label: "Доверие" },
  { key: "cta", label: "CTA" },
  { key: "clarity", label: "Ясность" },
  { key: "mobile", label: "Mobile" },
  { key: "visual", label: "Визуал" },
];

export function OverallScoreBlock({
  score = SAMPLE_REPORT.score,
  scoreVerdict = SAMPLE_REPORT.scoreVerdict,
  subScores,
}: OverallScoreBlockProps) {
  return (
    <div>
      <p className="font-mono-data text-xs font-medium uppercase tracking-widest text-[var(--text-muted)]">
        Overall score
      </p>
      <div className="mt-2 flex flex-wrap items-end gap-2">
        <ScoreNumber
          from={100}
          to={score}
          durationMs={1000}
          className="text-[64px] font-semibold leading-none sm:text-[80px] md:text-[96px]"
          glow="red"
        />
        <span className="pb-2 font-mono-data text-2xl text-[var(--text-muted)]">
          /100
        </span>
      </div>
      <p className="mt-3 text-sm text-[var(--text-secondary)]">
        {scoreVerdict}
      </p>
      {subScores ? (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {SUB_LABELS.map(({ key, label }) => (
            <div
              key={key}
              className="rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)] px-3 py-2"
            >
              <p className="font-mono-data text-[10px] uppercase text-[var(--text-muted)]">
                {label}
              </p>
              <p className="mt-1 font-mono-data text-lg font-semibold text-[var(--text-primary)]">
                {subScores[key]}
              </p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
