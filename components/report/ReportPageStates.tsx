import Link from "next/link";
import type { ReactNode } from "react";

import { ReportFooter } from "@/components/report/ReportFooter";
import { ReportHeader } from "@/components/report/ReportHeader";
import { scanErrorMessageForUi } from "@/lib/scan-display";

function Shell({ children }: { children: ReactNode }) {
  return (
    <div
      className="dark-zone flex min-h-screen flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]"
      style={{ backgroundImage: "url(/bg/grid-pattern.svg)" }}
    >
      <ReportHeader />
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
        {children}
      </div>
      <ReportFooter />
    </div>
  );
}

function statusLabel(status: string): string {
  switch (status) {
    case "pending":
      return "В очереди";
    case "scanning":
      return "Сканирование";
    case "analyzing":
      return "Анализ";
    default:
      return status;
  }
}

type ReportPendingStateProps = {
  scanId: string;
  status: string;
  step: string | null;
};

export function ReportPendingState({
  scanId,
  status,
  step,
}: ReportPendingStateProps) {
  return (
    <Shell>
      <p className="mb-2 font-mono-data text-xs uppercase tracking-[0.2em] text-[var(--accent-secondary)]">
        Отчёт готовится
      </p>
      <h1 className="mb-3 max-w-lg font-display text-2xl font-semibold tracking-tight sm:text-3xl">
        Мы ещё собираем данные по сайту
      </h1>
      <p className="mb-2 max-w-md text-[var(--text-secondary)]">
        {statusLabel(status)}
        {step && step !== "В очереди" ? ` · ${step}` : ""}
      </p>
      <p className="mb-10 max-w-md text-sm text-[var(--text-muted)]">
        Страница обновится, когда отчёт будет готов. Или вернитесь на экран
        сканирования.
      </p>
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <Link
          href={`/scanning/${scanId}`}
          className="rounded-lg border border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 px-6 py-3 text-sm font-medium text-[var(--accent-primary)] transition hover:bg-[var(--accent-primary)]/20"
        >
          Экран сканирования
        </Link>
        <Link
          href="/"
          className="text-sm text-[var(--text-muted)] underline-offset-4 hover:text-[var(--text-primary)] hover:underline"
        >
          На главную
        </Link>
      </div>
    </Shell>
  );
}

type ReportFailedStateProps = {
  message: string | null;
};

export function ReportFailedState({ message }: ReportFailedStateProps) {
  const text = scanErrorMessageForUi(message);
  return (
    <Shell>
      <p className="mb-2 font-mono-data text-xs uppercase tracking-[0.2em] text-[var(--accent-secondary)]">
        Ошибка
      </p>
      <h1 className="mb-4 max-w-lg font-display text-2xl font-semibold tracking-tight sm:text-3xl">
        Не удалось сформировать отчёт
      </h1>
      <p className="mb-10 max-w-md text-[var(--text-secondary)]">{text}</p>
      <Link
        href="/"
        className="text-sm text-[var(--accent-primary)] underline-offset-4 hover:underline"
      >
        ← На главную
      </Link>
    </Shell>
  );
}

export function ReportIncompleteState() {
  return (
    <Shell>
      <p className="mb-2 font-mono-data text-xs uppercase tracking-[0.2em] text-[var(--accent-secondary)]">
        Данные неполные
      </p>
      <h1 className="mb-4 max-w-lg font-display text-2xl font-semibold tracking-tight sm:text-3xl">
        Отчёт пока недоступен
      </h1>
      <p className="mb-10 max-w-md text-[var(--text-secondary)]">
        Формат результата сканирования не распознан. Попробуйте запустить
        проверку ещё раз.
      </p>
      <Link
        href="/"
        className="text-sm text-[var(--accent-primary)] underline-offset-4 hover:underline"
      >
        ← На главную
      </Link>
    </Shell>
  );
}
