import Link from "next/link";

import { Logo } from "@/components/shared/Logo";
import { BRAND } from "@/lib/brand";

export function ReportFooter() {
  return (
    <>
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
            © 2026 {BRAND.name}. {BRAND.tagline}.
          </p>
        </div>
      </footer>
    </>
  );
}
