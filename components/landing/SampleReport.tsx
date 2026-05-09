"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { Reveal } from "@/components/landing/motion";
import { ScanningOverlay } from "@/components/shared/ScanningOverlay";
import { ScoreNumber } from "@/components/shared/ScoreNumber";

const diagnosis = [
  { label: "Clear Value Proposition", level: "bad" as const },
  { label: "Strong CTA", level: "bad" as const },
  { label: "Mobile Optimization", level: "warn" as const },
  { label: "Page Speed", level: "warn" as const },
  { label: "Trust Signals", level: "bad" as const },
  { label: "SEO Structure", level: "ok" as const },
];

function DxIcon({ level }: { level: "bad" | "warn" | "ok" }) {
  if (level === "bad")
    return (
      <span
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded border border-[var(--accent-secondary)] text-xs font-bold text-[var(--accent-secondary)] shadow-[var(--glow-red)]"
        aria-hidden
      >
        ✗
      </span>
    );
  if (level === "warn")
    return (
      <span
        className="flex h-5 w-5 shrink-0 rotate-45 items-center justify-center border border-[var(--accent-warm)] text-[10px] text-[var(--accent-warm)]"
        aria-hidden
      >
        !
      </span>
    );
  return (
    <span
      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[var(--accent-success)] text-xs text-[var(--accent-success)]"
      aria-hidden
    >
      ✓
    </span>
  );
}

export function SampleReport() {
  return (
    <section
      className="py-16 lg:py-24"
      aria-labelledby="sample-report-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <h2
            id="sample-report-heading"
            className="font-display text-[28px] font-semibold tracking-tight text-[var(--text-primary)] sm:text-[32px] lg:text-[40px] xl:text-[48px]"
          >
            Вот так{" "}
            <span className="relative inline-block">
              <span className="relative z-[1]">выглядит диагноз</span>
              <span
                className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-[var(--accent-tech)]/70"
                aria-hidden
              />
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[17px] leading-relaxed text-[var(--text-secondary)] sm:text-[19px]">
            Реальный отчёт по одному из сайтов. Имя клиента скрыто.
          </p>
        </Reveal>

        <Reveal delay={0.08} className="mt-12">
          <div
            className="dark-zone w-full rounded-3xl border border-[rgba(0,212,255,0.15)] p-6 shadow-[0_24px_80px_rgba(10,14,26,0.3)] sm:p-10 lg:p-12"
            style={{
              background: "var(--bg-primary)",
            }}
          >
            <div className="flex flex-col gap-2 border-b border-[var(--border)] pb-4 font-mono-data text-[11px] uppercase tracking-widest text-[var(--accent-primary)] sm:flex-row sm:items-center sm:justify-between sm:text-xs">
              <span>WEBSITE X-RAY · DIAGNOSTIC REPORT</span>
              <span className="inline-flex items-center gap-2 text-[var(--text-muted)]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent-primary)]" />
                analyzing
              </span>
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-[3fr_2fr] lg:gap-10">
              <div>
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]">
                  <Image
                    src="/sample/screenshot-blurred.jpg"
                    alt=""
                    fill
                    className="object-cover brightness-[0.45]"
                    sizes="(max-width: 1024px) 100vw, 700px"
                  />
                  <ScanningOverlay />
                  <div
                    className="absolute inset-0 backdrop-blur-[2px]"
                    aria-hidden
                  />
                </div>
                <p className="mt-3 font-mono-data text-xs text-[var(--text-muted)]">
                  PATIENT: stomatologia-example.ru
                </p>
              </div>

              <div>
                <p className="font-mono-data text-xs font-medium uppercase tracking-widest text-[var(--text-muted)]">
                  Diagnosis
                </p>
                <ul className="mt-4 space-y-3">
                  {diagnosis.map((row, i) => (
                    <motion.li
                      key={row.label}
                      initial={{ opacity: 0, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{
                        duration: 0.35,
                        delay: i * 0.15,
                        ease: "easeOut",
                      }}
                      className="flex items-center gap-3 text-sm text-[var(--text-primary)]"
                    >
                      <DxIcon level={row.level} />
                      <span>{row.label}</span>
                    </motion.li>
                  ))}
                </ul>

                <div className="my-8 h-px bg-gradient-to-r from-transparent via-[var(--border-glow)] to-transparent" />

                <p className="font-mono-data text-xs font-medium uppercase tracking-widest text-[var(--text-muted)]">
                  Overall score
                </p>
                <div className="mt-2 flex flex-wrap items-end gap-2">
                  <ScoreNumber
                    from={100}
                    to={42}
                    durationMs={1000}
                    className="text-5xl leading-none text-[var(--accent-secondary)] sm:text-6xl lg:text-7xl"
                    glow="red"
                  />
                  <span className="pb-2 font-mono-data text-2xl text-[var(--text-muted)]">
                    /100
                  </span>
                </div>
                <div
                  className="mt-4 h-8 w-full max-w-[200px] rounded border border-[var(--border)] bg-[var(--bg-tertiary)]"
                  aria-hidden
                >
                  <svg
                    className="h-full w-full text-[var(--accent-secondary)] opacity-80"
                    preserveAspectRatio="none"
                    viewBox="0 0 200 32"
                  >
                    <path
                      d="M0 24 L30 8 L55 20 L80 6 L105 22 L130 10 L155 26 L180 12 L200 18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="mt-10 grid gap-8 border-t border-[var(--border)] pt-10 lg:grid-cols-2">
              <div>
                <p className="font-mono-data text-xs font-medium uppercase tracking-widest text-[var(--accent-primary)]">
                  Recommendations
                </p>
                <ul className="mt-4 space-y-2 text-sm text-[var(--text-secondary)]">
                  <li>· Усилить заголовок</li>
                  <li>· Добавить чёткий CTA</li>
                  <li>· Оптимизировать мобильную</li>
                  <li>· Добавить отзывы и кейсы</li>
                  <li>· Ускорить загрузку</li>
                </ul>
              </div>
              <div>
                <p className="font-mono-data text-xs font-medium uppercase tracking-widest text-[var(--accent-primary)]">
                  Preview fix
                </p>
                <div className="mt-4 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]">
                  <div className="relative aspect-video w-full max-w-sm">
                    <Image
                      src="/sample/preview-fix.svg"
                      alt=""
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                  <p className="border-t border-[var(--border)] px-4 py-3 text-sm text-[var(--text-primary)]">
                    «Ремонт под ключ за 45 дней — фиксированная смета»
                  </p>
                  <div className="border-t border-[var(--border)] px-4 py-3">
                    <span className="inline-flex rounded-lg border border-[var(--accent-primary)]/40 bg-[var(--bg-tertiary)] px-4 py-2 text-xs font-medium text-[var(--accent-primary)]">
                      Получить смету
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <p className="mt-10 text-center text-[17px] text-[var(--text-secondary)]">
          Это пример.{" "}
          <Link
            href="#hero"
            className="font-medium text-[var(--accent-primary)] underline-offset-4 transition-colors hover:text-[var(--accent-tech)] hover:underline"
          >
            Хотите такой по своему сайту?
          </Link>
        </p>
        <p className="mt-3 text-center text-sm text-[var(--text-muted)]">
          <Link
            href="/report/sample"
            className="font-medium text-[var(--text-secondary)] underline-offset-4 hover:text-[var(--accent-tech)] hover:underline"
          >
            Открыть полный демо-отчёт
          </Link>
        </p>
      </div>
    </section>
  );
}
