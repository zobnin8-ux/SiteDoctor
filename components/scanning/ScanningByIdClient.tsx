"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Logo } from "@/components/shared/Logo";
import { ScanningBackdrop } from "@/components/scanning/ScanningBackdrop";
import { ScanningProgress } from "@/components/scanning/ScanningProgress";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import {
  scanErrorMessageForUi,
  scanToCompletedSteps,
  type ScanStatusDb,
} from "@/lib/scan-display";
import { telegramHref } from "@/lib/telegram";

type ScanRow = {
  id: string;
  url: string;
  status: ScanStatusDb;
  progress: number;
  current_step: string | null;
  error_message: string | null;
};

function hostnameOnly(url: string): string {
  try {
    const u = url.startsWith("http") ? url : `https://${url}`;
    return new URL(u).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function ScanningByIdClient() {
  const params = useParams();
  const router = useRouter();
  const scanId = params.id as string;

  const [scan, setScan] = useState<ScanRow | null>(null);
  const [error, setError] = useState<string | null>(null);

  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  useEffect(() => {
    if (!scanId) return;

    let mounted = true;

    async function fetchInitial() {
      const { data, error: qErr } = await supabase
        .from("scans")
        .select("id, url, status, progress, current_step, error_message")
        .eq("id", scanId)
        .single();

      if (!mounted) return;

      if (qErr || !data) {
        setError("Сканирование не найдено");
        return;
      }

      const row = data as ScanRow;
      setScan(row);

      if (row.status === "ready") {
        router.push(`/report/${scanId}`);
      } else if (row.status === "failed") {
        setError(
          scanErrorMessageForUi(row.error_message) ||
            "Не удалось проанализировать сайт"
        );
      }
    }

    void fetchInitial();

    const channel = supabase
      .channel(`scan-${scanId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "scans",
          filter: `id=eq.${scanId}`,
        },
        (payload) => {
          if (!mounted) return;
          const updated = payload.new as ScanRow;
          setScan(updated);

          if (updated.status === "ready") {
            setTimeout(() => router.push(`/report/${scanId}`), 800);
          } else if (updated.status === "failed") {
            setError(
              scanErrorMessageForUi(updated.error_message) ||
                "Не удалось проанализировать сайт"
            );
          }
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      void supabase.removeChannel(channel);
    };
  }, [scanId, router, supabase]);

  if (error) {
    return (
      <main className="dark-zone flex min-h-screen items-center justify-center bg-[var(--bg-primary)] p-6 text-[var(--text-primary)]">
        <div className="w-full max-w-md text-center">
          <p className="mb-2 font-mono-data text-xs uppercase tracking-[0.2em] text-[var(--accent-secondary)]">
            Ошибка
          </p>
          <h1 className="mb-4 font-display text-2xl">
            Не удалось проанализировать сайт
          </h1>
          <p className="mb-8 text-[var(--text-secondary)]">{error}</p>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="text-[var(--accent-primary)] hover:underline"
          >
            ← Вернуться на главную
          </button>
        </div>
      </main>
    );
  }

  if (!scan) {
    return (
      <main className="dark-zone flex min-h-screen items-center justify-center bg-[var(--bg-primary)] text-[var(--text-primary)]">
        <p className="font-mono-data text-sm text-[var(--text-muted)]">
          Загружаем…
        </p>
      </main>
    );
  }

  const completedSteps = scanToCompletedSteps(
    scan.current_step,
    scan.status
  );
  const hostLabel = hostnameOnly(scan.url);

  return (
    <main
      className="dark-zone relative min-h-screen overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)]"
      style={{ backgroundImage: "url(/bg/grid-pattern.svg)" }}
    >
      <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--bg-primary)]/90 backdrop-blur-md">
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

      <div className="relative flex min-h-[calc(100vh-3.5rem)] w-full flex-col">
        <ScanningBackdrop />

        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-12">
          <ScanningProgress
            completedSteps={completedSteps}
            progress={scan.progress}
            hostLabel={hostLabel}
          />
        </div>
      </div>
    </main>
  );
}
