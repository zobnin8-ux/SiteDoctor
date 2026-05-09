"use client";

import { motion } from "framer-motion";
import { ListChecks, PenLine, Stethoscope } from "lucide-react";

import { Reveal } from "@/components/landing/motion";

const cards = [
  {
    icon: Stethoscope,
    title: "Честный диагноз",
    body: "Не технический аудит и не SEO-отчёт. Простыми словами: что не так с вашим сайтом глазами клиента, который зашёл первый раз.",
  },
  {
    icon: ListChecks,
    title: "Список проблем по приоритету",
    body: "От самой критичной до косметической. Чтобы вы знали, что чинить в первую очередь — а что может подождать.",
  },
  {
    icon: PenLine,
    title: "Готовые тексты на замену",
    body: "Не абстрактные советы «усильте оффер», а конкретные формулировки для главного экрана и кнопок. Скопировал — вставил.",
  },
] as const;

export function WhatYouGet() {
  return (
    <section
      className="py-16 lg:py-24"
      aria-labelledby="what-you-get-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <h2
            id="what-you-get-heading"
            className="font-display text-[28px] font-semibold tracking-tight text-[var(--text-primary)] sm:text-[32px] lg:text-[40px] xl:text-[48px]"
          >
            Что вы получите
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[17px] leading-relaxed text-[var(--text-secondary)] sm:text-[19px]">
            Не сухой технический аудит. Понятный диагноз глазами клиента, который
            зашёл на ваш сайт первый раз.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {cards.map((card, i) => (
            <Reveal key={card.title} delay={i * 0.1}>
              <motion.article
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="h-full rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-8 shadow-card hover:shadow-card-hover"
              >
                <card.icon
                  className="h-8 w-8 text-[var(--accent-secondary)]"
                  strokeWidth={1.75}
                  aria-hidden
                />
                <h3 className="mt-5 font-display text-xl font-semibold tracking-tight text-[var(--text-primary)]">
                  {card.title}
                </h3>
                <p className="mt-3 text-[17px] leading-relaxed text-[var(--text-secondary)]">
                  {card.body}
                </p>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
