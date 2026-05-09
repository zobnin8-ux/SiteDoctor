import { SAMPLE_REPORT } from "@/lib/sample-report";
import { cn } from "@/lib/utils";

const border: Record<"critical" | "warning", string> = {
  critical: "border-l-[var(--accent-secondary)]",
  warning: "border-l-[var(--accent-warm)]",
};

const label: Record<"critical" | "warning", string> = {
  critical: "Критично",
  warning: "Важно",
};

export function TopIssues() {
  return (
    <section className="border-t border-[var(--border)] bg-[var(--bg-secondary)]/30 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          Top issues
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {SAMPLE_REPORT.topIssues.map((issue) => (
            <article
              key={issue.id}
              className={cn(
                "rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] p-6",
                "border-l-4",
                border[issue.severity]
              )}
            >
              <span className="inline-flex rounded-full border border-[var(--accent-secondary)]/50 bg-[var(--bg-tertiary)] px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--accent-secondary)]">
                {label[issue.severity]}
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-[var(--text-primary)]">
                {issue.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                {issue.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
