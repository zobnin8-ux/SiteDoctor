"use client";

import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/landing/motion";
import { ASSETS } from "@/lib/assets";

export function SampleReport() {
  return (
    <section
      className="py-16 lg:py-24"
      aria-labelledby="sample-report-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <h2
            id="sample-report-heading"
            className="font-display text-[28px] font-semibold tracking-tight text-[var(--text-primary)] sm:text-[32px] lg:text-[40px] xl:text-[48px]"
          >
            Вот так выглядит диагноз
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[17px] leading-relaxed text-[var(--text-secondary)] sm:text-[19px]">
            Реальный отчёт по одному из сайтов. Имя клиента скрыто.
          </p>
        </Reveal>

        <Reveal delay={0.08} className="mt-12">
          <div className="relative overflow-hidden rounded-3xl border border-[rgba(0,184,217,0.15)] shadow-[0_24px_80px_rgba(10,14,26,0.3)]">
            <Image
              src={ASSETS.sample.reportBg}
              alt="Пример отчёта Site Doctor"
              width={1600}
              height={1000}
              className="h-auto w-full"
              sizes="(max-width: 1152px) 100vw, 1152px"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[rgba(10,14,26,0.4)]"
              aria-hidden
            />
          </div>
        </Reveal>

        <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-[var(--text-muted)]">
          Слева — диагноз по 6 ключевым показателям. Справа — общий скор и
          рекомендации. На вашем отчёте всё будет на русском.
        </p>

        <div className="mt-6 text-center">
          <Link
            href="#hero"
            className="font-medium text-[var(--accent-tech)] hover:underline"
          >
            Это пример. Хотите такой по своему сайту? →
          </Link>
        </div>

        <p className="mt-4 text-center text-sm text-[var(--text-muted)]">
          <Link
            href="/report/sample"
            className="font-medium text-[var(--text-secondary)] underline-offset-4 hover:text-[var(--accent-tech)] hover:underline"
          >
            Открыть полный демо-отчёт
          </Link>
        </p>
      </div>
    </section>
  );
}
