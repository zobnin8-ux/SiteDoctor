"use client";

import { UrlForm } from "@/components/landing/UrlForm";
import { Reveal } from "@/components/landing/motion";

export function FinalCta() {
  return (
    <section
      className="py-16 lg:py-24"
      aria-labelledby="final-cta-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg-tertiary)] px-6 py-14 shadow-card sm:px-10 lg:px-16 lg:py-20">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2
              id="final-cta-heading"
              className="font-display text-[28px] font-semibold tracking-tight text-[var(--text-primary)] sm:text-[32px] lg:text-[40px]"
            >
              Готовы узнать, что не так с вашим сайтом?
            </h2>
            <p className="mt-4 text-[17px] leading-relaxed text-[var(--text-secondary)] sm:text-[19px]">
              Введите адрес — через минуту вы будете знать, что чинить в первую
              очередь.
            </p>
          </Reveal>
          <Reveal delay={0.08} className="mx-auto mt-8 max-w-2xl">
            <UrlForm microCentered showMicroBullets={false} />
            <p className="mt-4 text-center text-sm text-[var(--text-muted)]">
              Бесплатно. Без регистрации. Результат через минуту.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
