import { SAMPLE_REPORT } from "@/lib/sample-report";
import { cn } from "@/lib/utils";

type SampleFixProps = {
  before?: string;
  after?: string;
};

export function SampleFix({
  before = SAMPLE_REPORT.sampleFix.before,
  after = SAMPLE_REPORT.sampleFix.after,
}: SampleFixProps) {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          Sample fix
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-tertiary)] p-6">
            <p className="font-mono-data text-xs uppercase text-[var(--text-muted)]">
              Было
            </p>
            <p className="mt-3 text-[17px] italic text-[var(--text-secondary)]">
              «{before}»
            </p>
          </div>
          <div
            className={cn(
              "rounded-2xl border border-[var(--border)] border-l-4 bg-[var(--bg-secondary)] p-6",
              "border-l-[var(--accent-success)]"
            )}
          >
            <p className="font-mono-data text-xs uppercase text-[var(--text-muted)]">
              Стало
            </p>
            <p className="mt-3 text-[17px] font-medium leading-relaxed text-[var(--text-primary)]">
              «{after}»
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
