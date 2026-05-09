"use client";

import Link from "next/link";
import {
  Camera,
  Car,
  Cross,
  GraduationCap,
  Hammer,
  Home,
  Scale,
  Sparkles,
  Wrench,
} from "lucide-react";

import { Reveal } from "@/components/landing/motion";

const categories = [
  { label: "Риелторы и агентства недвижимости", Icon: Home },
  { label: "Стоматологии и частные клиники", Icon: Cross },
  { label: "Студии ремонта и прорабы", Icon: Hammer },
  { label: "Юристы и адвокаты", Icon: Scale },
  { label: "Салоны красоты и косметологии", Icon: Sparkles },
  { label: "Автосервисы", Icon: Car },
  { label: "Частные школы и репетиторы", Icon: GraduationCap },
  { label: "Фотографы и видеографы", Icon: Camera },
  { label: "Любой локальный бизнес с сайтом", Icon: Wrench },
] as const;

export function ForWhom() {
  return (
    <section className="py-16 lg:py-24" aria-labelledby="for-whom-heading">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <h2
            id="for-whom-heading"
            className="font-display text-[28px] font-semibold tracking-tight text-[var(--text-primary)] sm:text-[32px] lg:text-[40px] xl:text-[48px]"
          >
            Для кого этот сервис
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-[19px] leading-relaxed text-[var(--text-secondary)]">
            Для владельцев малого бизнеса, у которых уже есть сайт, но клиентов с
            него мало или нет совсем.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => (
            <Reveal key={cat.label} delay={(i % 3) * 0.05}>
              <div className="flex items-center gap-3 rounded-full bg-[var(--bg-tertiary)] px-6 py-4">
                <cat.Icon
                  className="h-5 w-5 shrink-0 text-[var(--accent-secondary)]"
                  strokeWidth={1.75}
                  aria-hidden
                />
                <span className="text-[15px] font-medium leading-snug text-[var(--text-primary)] sm:text-[16px]">
                  {cat.label}
                </span>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="mt-10 text-center text-[17px] text-[var(--text-secondary)]">
          Не уверены, подойдёт ли вам? Просто введите адрес — диагностика
          бесплатная.{" "}
          <Link
            href="#hero"
            className="font-medium text-[var(--accent-primary)] underline-offset-4 hover:underline"
          >
            Проверить сайт
          </Link>
        </p>
      </div>
    </section>
  );
}
