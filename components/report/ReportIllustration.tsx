import Image from "next/image";

/** Иллюстрация «операционная Site Doctor AI» над блоком пациента. */
export function ReportIllustration() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-2 pb-2 sm:px-6 sm:pt-4 lg:px-8">
      <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-tertiary)] shadow-[0_0_48px_rgba(59,130,246,0.12)]">
        <div className="relative aspect-[16/9] w-full max-h-[min(52vh,480px)] sm:max-h-[min(56vh,520px)]">
          <Image
            src="/report/hero-ai-lab.png"
            alt="Site Doctor AI — диагностика и оптимизация сайта"
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, min(1152px, 92vw)"
            priority
          />
        </div>
      </div>
    </div>
  );
}
