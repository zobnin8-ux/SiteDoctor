import Link from "next/link";

import { Logo } from "@/components/shared/Logo";
import { BRAND } from "@/lib/brand";
import { telegramHref, telegramLinkNewTabProps } from "@/lib/telegram";

export function Footer() {
  return (
    <footer className="bg-[var(--bg-tertiary)] py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 sm:px-6 lg:flex-row lg:justify-between lg:px-8">
        <div className="flex flex-col items-center gap-2 text-center lg:items-start lg:text-left">
          <Logo variant="light" />
          <p className="text-sm text-[var(--text-secondary)]">{BRAND.tagline}</p>
        </div>

        <div className="flex flex-col items-center gap-3 text-sm sm:flex-row sm:gap-6">
          <Link
            href="/report/sample"
            className="text-[var(--text-secondary)] underline-offset-4 hover:text-[var(--accent-tech)] hover:underline"
          >
            Пример отчёта
          </Link>
          <Link
            href="/privacy"
            className="text-[var(--text-secondary)] underline-offset-4 hover:text-[var(--text-primary)] hover:underline"
          >
            Политика конфиденциальности
          </Link>
          <a
            href={telegramHref()}
            {...telegramLinkNewTabProps}
            className="text-[var(--text-secondary)] underline-offset-4 hover:text-[var(--accent-tech)] hover:underline"
          >
            Связаться
          </a>
        </div>

        <div className="text-center text-sm text-[var(--text-muted)] lg:text-right">
          <p>
            Сделано в{" "}
            <a
              href={BRAND.parentUrl}
              className="font-medium text-[var(--accent-warm)] underline-offset-4 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              {BRAND.parentBrand}
            </a>
          </p>
          <p className="mt-1">© 2026</p>
        </div>
      </div>
    </footer>
  );
}
