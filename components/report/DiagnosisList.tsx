"use client";

import { SAMPLE_REPORT } from "@/lib/sample-report";

function StatusIcon({
  status,
}: {
  status: "critical" | "warning" | "ok";
}) {
  if (status === "critical")
    return (
      <span
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded border border-[var(--accent-secondary)] text-xs font-bold text-[var(--accent-secondary)]"
        style={{ boxShadow: "var(--glow-red)" }}
        aria-hidden
      >
        ✗
      </span>
    );
  if (status === "warning")
    return (
      <span
        className="flex h-6 w-6 shrink-0 rotate-45 items-center justify-center border-2 border-[var(--accent-warm)] text-[10px] font-bold text-[var(--accent-warm)]"
        aria-hidden
      >
        !
      </span>
    );
  return (
    <span
      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-[var(--accent-success)] text-sm text-[var(--accent-success)]"
      aria-hidden
    >
      ✓
    </span>
  );
}

function statusLabel(status: "critical" | "warning" | "ok") {
  if (status === "critical") return "Critical";
  if (status === "warning") return "Warning";
  return "OK";
}

export function DiagnosisList({ className }: { className?: string }) {
  return (
    <div className={className}>
      <p className="font-mono-data text-xs font-medium uppercase tracking-widest text-[var(--text-muted)]">
        Diagnosis
      </p>
      <ul className="mt-4 space-y-3">
        {SAMPLE_REPORT.diagnosis.map((row) => (
          <li
            key={row.id}
            className="flex items-center gap-3 text-sm text-[var(--text-primary)]"
          >
            <StatusIcon status={row.status} />
            <span className="flex-1">{row.label}</span>
            <span className="font-mono-data text-[10px] uppercase text-[var(--text-muted)]">
              {statusLabel(row.status)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
