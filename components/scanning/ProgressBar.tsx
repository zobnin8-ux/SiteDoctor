"use client";

import { cn } from "@/lib/utils";

type Props = {
  value: number;
  className?: string;
};

export function ProgressBar({ value, className }: Props) {
  const pct = Math.round(Math.min(100, Math.max(0, value)));
  return (
    <div className={cn("w-full", className)}>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--bg-tertiary)]">
        <div
          className="h-full rounded-full bg-[var(--accent-primary)] transition-[width] duration-200 ease-out"
          style={{
            width: `${pct}%`,
            boxShadow: "var(--glow-cyan)",
          }}
        />
      </div>
      <p className="mt-2 text-right font-mono-data text-xs text-[var(--text-muted)]">
        {pct}%
      </p>
    </div>
  );
}
