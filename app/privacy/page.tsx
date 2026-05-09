import Link from "next/link";

import { BRAND } from "@/lib/brand";

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-24">
      <h1 className="font-display mb-8 text-4xl tracking-tight text-[var(--text-primary)]">
        Политика конфиденциальности
      </h1>
      <div className="max-w-none space-y-4 text-[17px] leading-relaxed text-[var(--text-secondary)]">
        <p>
          Site Doctor собирает только URL сайтов, которые пользователи добровольно
          вводят для анализа. Мы не запрашиваем регистрацию, не собираем
          персональные данные и не передаём данные третьим лицам.
        </p>
        <p>
          Cookies используются только для базовой аналитики использования сервиса
          (анонимной).
        </p>
        <p>
          По вопросам приватности:{" "}
          <a
            href={`mailto:${BRAND.contactEmail}`}
            className="font-medium text-[var(--accent-tech)] underline-offset-4 hover:underline"
          >
            {BRAND.contactEmail}
          </a>
        </p>
      </div>
      <Link
        href="/"
        className="mt-10 inline-block text-sm font-medium text-[var(--accent-primary)] underline-offset-4 hover:underline"
      >
        На главную
      </Link>
    </main>
  );
}
