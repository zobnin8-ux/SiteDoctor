import Link from "next/link";

import { BRAND } from "@/lib/brand";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl rounded-3xl border border-[var(--border)] bg-[var(--bg-secondary)] p-8 shadow-card sm:p-10">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
          Политика конфиденциальности
        </h1>
        <p className="mt-4 text-[17px] leading-relaxed text-[var(--text-secondary)]">
          Заглушка. Текст политики для сервиса «{BRAND.name}» будет добавлен перед
          запуском.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block text-sm font-medium text-[var(--accent-primary)] underline-offset-4 hover:underline"
        >
          На главную
        </Link>
      </div>
    </div>
  );
}
