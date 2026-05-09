"use client";

type Props = {
  steps: readonly string[];
  completedSteps: number;
};

export function StepsList({ steps, completedSteps }: Props) {
  return (
    <ul className="mt-10 w-full space-y-3 text-left text-sm">
      {steps.map((label, i) => {
        const done = i < completedSteps;
        const active = i === completedSteps && completedSteps < steps.length;
        return (
          <li
            key={label}
            className="flex items-center gap-3 text-[var(--text-secondary)]"
          >
            <span className="font-mono-data w-5 shrink-0 text-center">
              {done ? (
                <span className="text-[var(--accent-success)]">✓</span>
              ) : active ? (
                <span className="text-[var(--accent-primary)]">⏳</span>
              ) : (
                <span className="text-[var(--text-muted)]">○</span>
              )}
            </span>
            <span
              className={
                done || active
                  ? "text-[var(--text-primary)]"
                  : "text-[var(--text-muted)]"
              }
            >
              {label}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
