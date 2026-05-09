"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import { ScanningOverlay } from "@/components/shared/ScanningOverlay";
import { ScoreNumber } from "@/components/shared/ScoreNumber";
import {
  SAMPLE_DIAGNOSIS,
  SAMPLE_FIX,
  SAMPLE_PATIENT_HOST,
  SAMPLE_REPORT_DATE,
  SAMPLE_SCORE,
  SAMPLE_TOP_ISSUES,
} from "@/lib/sample-report";
import { BRAND } from "@/lib/brand";
import { fullReportHref, fullReportMailto } from "@/lib/contact";
import { telegramHref } from "@/lib/telegram";
import { cn } from "@/lib/utils";

function StatusIcon({ level }: { level: "critical" | "warning" | "ok" }) {
  if (level === "critical")
    return (
      <span
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded border border-[var(--accent-secondary)] text-xs font-bold text-[var(--accent-secondary)]"
        style={{ boxShadow: "var(--glow-red)" }}
        aria-hidden
      >
        ✗
      </span>
    );
  if (level === "warning")
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

function MonitorFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <span
        className="pointer-events-none absolute -left-1 -top-1 h-4 w-4 border-l-2 border-t-2 border-[var(--accent-primary)]"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute -right-1 -top-1 h-4 w-4 border-r-2 border-t-2 border-[var(--accent-primary)]"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute -bottom-1 -left-1 h-4 w-4 border-b-2 border-l-2 border-[var(--accent-primary)]"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute -bottom-1 -right-1 h-4 w-4 border-b-2 border-r-2 border-[var(--accent-primary)]"
        aria-hidden
      />
      {children}
    </div>
  );
}

export function SampleReportDemo() {
  return (
    <div
      className="dark-zone min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]"
      style={{ backgroundImage: "url(/bg/grid-pattern.svg)" }}
    >
      <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--bg-primary)]/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Logo variant="dark" />
          <span className="hidden font-mono-data text-[10px] uppercase tracking-widest text-[var(--text-muted)] sm:inline sm:text-xs">
            WEBSITE X-RAY
          </span>
          <a
            href={telegramHref()}
            className="text-xs font-medium text-[var(--accent-primary)] underline-offset-4 hover:underline sm:text-sm"
          >
            Связаться
          </a>
        </div>
      </header>

      <section className="border-b border-[var(--border)] bg-[var(--bg-secondary)]/40 py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="font-mono-data text-xs uppercase tracking-widest text-[var(--accent-primary)]">
            PATIENT: {SAMPLE_PATIENT_HOST}
          </p>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Diagnostic completed · {SAMPLE_REPORT_DATE}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[3fr_2fr] lg:items-start">
          <div>
            <MonitorFrame>
              <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)]">
                <Image
                  src="/sample/screenshot-blurred.jpg"
                  alt=""
                  fill
                  className="object-cover brightness-[0.5]"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  priority
                />
                <ScanningOverlay />
                <div className="absolute inset-0 backdrop-blur-[1px]" aria-hidden />
              </div>
            </MonitorFrame>
            <div className="mt-4 flex flex-wrap gap-4 font-mono-data text-xs text-[var(--text-muted)]">
              <span>LCP ~3.2s</span>
              <span>CLS 0.14</span>
              <span>Trust: low</span>
            </div>
          </div>

          <div>
            <p className="font-mono-data text-xs font-medium uppercase tracking-widest text-[var(--text-muted)]">
              Overall score
            </p>
            <div className="mt-2 flex flex-wrap items-end gap-2">
              <ScoreNumber
                from={100}
                to={SAMPLE_SCORE}
                durationMs={1000}
                className="text-6xl leading-none text-[var(--accent-secondary)] sm:text-7xl"
                glow="red"
              />
              <span className="pb-2 font-mono-data text-2xl text-[var(--text-muted)]">
                /100
              </span>
            </div>
            <p className="mt-3 text-sm text-[var(--text-secondary)]">
              Требует серьёзного вмешательства
            </p>

            <div
              className="my-8 h-px w-full bg-gradient-to-r from-transparent via-[var(--border-glow)] to-transparent"
              aria-hidden
            />

            <p className="font-mono-data text-xs font-medium uppercase tracking-widest text-[var(--text-muted)]">
              Diagnosis
            </p>
            <ul className="mt-4 space-y-3">
              {SAMPLE_DIAGNOSIS.map((row) => (
                <li
                  key={row.id}
                  className="flex items-center gap-3 text-sm text-[var(--text-primary)]"
                >
                  <StatusIcon
                    level={
                      row.level === "critical"
                        ? "critical"
                        : row.level === "warning"
                          ? "warning"
                          : "ok"
                    }
                  />
                  <span className="flex-1">{row.label}</span>
                  <span className="font-mono-data text-[10px] uppercase text-[var(--text-muted)]">
                    {row.level === "critical"
                      ? "Critical"
                      : row.level === "warning"
                        ? "Warning"
                        : "OK"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--border)] bg-[var(--bg-secondary)]/30 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Top issues
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {SAMPLE_TOP_ISSUES.map((issue) => (
              <article
                key={issue.title}
                className="rounded-2xl border border-[var(--border)] bg-[var(--bg-primary)] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
              >
                <span className="inline-flex rounded-full border border-[var(--accent-secondary)]/50 bg-[var(--bg-tertiary)] px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--accent-secondary)]">
                  {issue.severity}
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-[var(--text-primary)]">
                  {issue.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                  {issue.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Sample fix
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-tertiary)] p-6">
              <p className="font-mono-data text-xs uppercase text-[var(--text-muted)]">
                До
              </p>
              <p className="mt-3 text-[17px] italic text-[var(--text-secondary)]">
                «{SAMPLE_FIX.before}»
              </p>
            </div>
            <div
              className={cn(
                "rounded-2xl border border-[var(--border)] border-l-4 bg-[var(--bg-secondary)] p-6",
                "border-l-[var(--accent-success)]"
              )}
            >
              <p className="font-mono-data text-xs uppercase text-[var(--text-muted)]">
                После
              </p>
              <p className="mt-3 text-[17px] font-medium leading-relaxed text-[var(--text-primary)]">
                «{SAMPLE_FIX.after}»
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#e8e5de] bg-[#fafaf7] py-16 text-[#1a1a1a]">
        <div className="mx-auto max-w-3xl rounded-3xl border border-[#e8e5de] bg-white px-6 py-12 text-center shadow-[0_24px_80px_rgba(10,14,26,0.12)] sm:px-10">
          <p className="text-[17px] leading-relaxed text-[#5c5c5c]">
            Это бесплатная версия. В полном отчёте — все 12 проблем, готовые
            тексты для всей главной страницы и SEO-теги.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-8 rounded-xl bg-[#e53e3e] text-white hover:opacity-95"
          >
            <a href={fullReportHref()}>Получить полный отчёт за 1 490 ₽</a>
          </Button>
          <p className="mt-4 text-sm text-[#9a9a9a]">
            Или:{" "}
            <a
              href={fullReportMailto()}
              className="font-medium text-[#00b8d9] underline-offset-4 hover:underline"
            >
              написать на почту
            </a>
            {" · "}
            <a
              href={telegramHref()}
              className="font-medium text-[#00b8d9] underline-offset-4 hover:underline"
            >
              обсудить переделку в Telegram
            </a>
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 text-center sm:flex-row sm:justify-center sm:gap-8 sm:px-6 lg:px-8">
          <span className="text-sm text-[var(--text-muted)]">
            Поделиться отчётом — скопируйте ссылку
          </span>
          <Link
            href="/"
            className="text-sm font-medium text-[var(--accent-primary)] underline-offset-4 hover:underline"
          >
            Назад на главную
          </Link>
        </div>
      </section>

      <footer className="border-t border-[var(--border)] py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
          <Logo variant="dark" />
          <p className="text-center text-xs text-[var(--text-muted)]">
            © {new Date().getFullYear()} {BRAND.name}. {BRAND.tagline}.
          </p>
        </div>
      </footer>

      <div className="pointer-events-none fixed bottom-6 right-6 hidden opacity-40 lg:block">
        <Image
          src="/robot/report-robot.png"
          alt=""
          width={120}
          height={120}
          className="object-contain"
        />
      </div>
    </div>
  );
}
