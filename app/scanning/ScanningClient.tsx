"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Logo } from "@/components/shared/Logo";
import { ScanningProgress } from "@/components/scanning/ScanningProgress";
import { telegramHref } from "@/lib/telegram";

const STEPS = [
  { duration: 1500 },
  { duration: 2000 },
  { duration: 2500 },
  { duration: 2000 },
  { duration: 2000 },
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

  const [completedSteps, setCompletedSteps] = useState(0);
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
        window.setTimeout(() => setCompletedSteps(idx + 1), elapsed)
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
      style={{ backgroundImage: "url(/bg/grid-pattern.svg)" }}
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
        <ScanningProgress
          completedSteps={completedSteps}
          progress={progress}
          hostLabel={host}
        />
      </div>
    </main>
  );
}
