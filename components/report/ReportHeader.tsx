import { Logo } from "@/components/shared/Logo";
import { telegramHref } from "@/lib/telegram";

export function ReportHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--bg-primary)]/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo variant="dark" />
        <span className="hidden text-center font-mono-data text-[10px] uppercase tracking-widest text-[var(--text-muted)] sm:block sm:text-xs">
          {`Site Doctor · WEBSITE X-RAY`}
        </span>
        <a
          href={telegramHref()}
          className="text-xs font-medium text-[var(--accent-primary)] underline-offset-4 hover:underline sm:text-sm"
        >
          Связаться
        </a>
      </div>
    </header>
  );
}
