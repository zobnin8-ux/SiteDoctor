export function AiUnavailableBanner() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 lg:px-8">
      <div
        className="rounded-lg border border-[var(--accent-warm)]/40 bg-[var(--accent-warm)]/10 px-4 py-3 text-sm leading-relaxed text-[var(--text-secondary)]"
        role="status"
      >
        AI-разбор временно недоступен. Показываем технические результаты
        сканирования. Свяжитесь с нами для подробного анализа.
      </div>
    </div>
  );
}
