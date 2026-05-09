"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Logo } from "@/components/shared/Logo";
import { SCANNING_ROBOT_IMAGE } from "@/lib/brand";
import { telegramHref } from "@/lib/telegram";

const STEPS = [
  { label: "Открываем главную страницу", duration: 1500 },
  { label: "Сканируем мобильную версию", duration: 2000 },
  { label: "Анализируем тексты и призывы", duration: 2500 },
  { label: "Проверяем сигналы доверия", duration: 2000 },
  { label: "Формируем диагноз", duration: 2000 },
] as const;

const TOTAL_MS = STEPS.reduce((a, s) => a + s.duration, 0);

function hostnameOnly(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function ScanningClient() {
  const params = useSearchParams();
  const router = useRouter();
  const url = params.get("url") ?? "";
  const host = url ? hostnameOnly(url) : "…";

  const [completed, setCompleted] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const tick = () => {
      const e = performance.now() - start;
      setProgress(Math.min(100, (e / TOTAL_MS) * 100));
    };
    const iv = window.setInterval(tick, 80);
    tick();

    let elapsed = 0;
    const timeouts: number[] = [];
    STEPS.forEach((step, idx) => {
      elapsed += step.duration;
      timeouts.push(
        window.setTimeout(() => setCompleted(idx + 1), elapsed)
      );
    });
    timeouts.push(
      window.setTimeout(() => router.push("/report/sample"), elapsed + 500)
    );

    return () => {
      window.clearInterval(iv);
      timeouts.forEach((t) => window.clearTimeout(t));
    };
  }, [router]);

  return (
    <main
      className="dark-zone relative min-h-screen overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)]"
      style={{
        backgroundImage: "url(/bg/grid-pattern.svg)",
      }}
    >
      <header className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--bg-primary)]/90 backdrop-blur-md">
        <div className="mx-auto grid h-14 w-full max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 sm:px-6 lg:px-8">
          <Logo variant="dark" className="justify-self-start" />
          <span className="justify-self-center font-mono-data text-[10px] uppercase tracking-widest text-[var(--text-muted)] sm:text-xs">
            WEBSITE X-RAY
          </span>
          <a
            href={telegramHref()}
            className="justify-self-end text-xs font-medium text-[var(--accent-primary)] underline-offset-4 hover:underline sm:text-sm"
          >
            Связаться
          </a>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-4 py-12">
        <div className="flex w-full max-w-md flex-col items-center text-center">
          <Image
            src={SCANNING_ROBOT_IMAGE}
            alt=""
            width={320}
            height={320}
            className="h-40 w-40 object-contain sm:h-72 sm:w-72"
            priority
          />

          <p className="mt-6 font-mono-data text-xs font-medium uppercase tracking-[0.2em] text-[var(--accent-primary)]">
            WEBSITE X-RAY
          </p>
          <p className="mt-2 font-display text-lg font-semibold text-[var(--text-primary)] sm:text-xl">
            Анализируем {host}…
          </p>

          <ul className="mt-10 w-full space-y-3 text-left text-sm">
            {STEPS.map((step, i) => {
              const done = i < completed;
              const active = i === completed && completed < STEPS.length;
              const pending = i > completed;
              return (
                <li
                  key={step.label}
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
                    {step.label}
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="mt-8 w-full">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--bg-tertiary)]">
              <div
                className="h-full rounded-full bg-[var(--accent-primary)] transition-[width] duration-200 ease-out"
                style={{
                  width: `${Math.min(100, progress)}%`,
                  boxShadow: "var(--glow-cyan)",
                }}
              />
            </div>
            <p className="mt-2 text-right font-mono-data text-xs text-[var(--text-muted)]">
              {Math.round(Math.min(100, progress))}%
            </p>
          </div>

          <p className="mt-8 text-xs leading-relaxed text-[var(--text-muted)] sm:text-sm">
            Обычно занимает 30–60 секунд. Не закрывайте страницу.
          </p>
        </div>
      </div>
    </main>
  );
}
