"use client";

import { ScoreNumber } from "@/components/shared/ScoreNumber";
import { SAMPLE_REPORT } from "@/lib/sample-report";

export function OverallScoreBlock() {
  return (
    <div>
      <p className="font-mono-data text-xs font-medium uppercase tracking-widest text-[var(--text-muted)]">
        Overall score
      </p>
      <div className="mt-2 flex flex-wrap items-end gap-2">
        <ScoreNumber
          from={100}
          to={SAMPLE_REPORT.score}
          durationMs={1000}
          className="text-[64px] font-semibold leading-none sm:text-[80px] md:text-[96px]"
          glow="red"
        />
        <span className="pb-2 font-mono-data text-2xl text-[var(--text-muted)]">
          /100
        </span>
      </div>
      <p className="mt-3 text-sm text-[var(--text-secondary)]">
        {SAMPLE_REPORT.scoreVerdict}
      </p>
    </div>
  );
}
