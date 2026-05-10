"use client";

import { Logo } from "@/components/shared/Logo";
import { telegramHref, telegramLinkNewTabProps } from "@/lib/telegram";

export function Header() {
  return (
    <header className="sticky top-0 z-50 h-16 border-b border-[var(--border)] bg-white/70 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo variant="light" className="transition-opacity hover:opacity-80" />
        <a
          href={telegramHref()}
          {...telegramLinkNewTabProps}
          className="text-sm font-medium text-[var(--text-secondary)] underline-offset-4 hover:text-[var(--accent-tech)] hover:underline"
        >
          Связаться
        </a>
      </div>
    </header>
  );
}
