"use client";

import { Reveal } from "@/components/landing/motion";

const steps = [
  {
    n: "1",
    title: "Вы вводите адрес сайта",
    text: "Только URL, ничего больше. Без регистрации, без анкет, без e-mail.",
  },
  {
    n: "2",
    title: "Мы открываем ваш сайт глазами клиента",
    text: "Смотрим как обычный посетитель: десктопный и мобильный экран, тексты, кнопки, первое впечатление.",
  },
  {
    n: "3",
    title: "Получаете диагноз через минуту",
    text: "На выходе — страница отчёта: балл, приоритетные проблемы и разбор по фактам с главной и скринам. Ссылку можно сохранить или отправить себе на почту.",
  },
] as const;

export function HowItWorks() {
  return (
    <section className="py-16 lg:py-24" aria-labelledby="how-heading">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <h2
            id="how-heading"
            className="text-center font-display text-[28px] font-semibold tracking-tight text-[var(--text-primary)] sm:text-[32px] lg:text-[40px] xl:text-[48px]"
          >
            Как это работает
          </h2>
        </Reveal>

        <div className="relative mt-14 lg:mt-16">
          <div className="grid gap-12 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-start lg:gap-4">
            {steps.flatMap((step, i) => {
              const block = (
                <Reveal
                  key={step.n}
                  delay={i * 0.1}
                  className="text-center lg:text-left"
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent-secondary)] font-display text-xl font-semibold text-white lg:mx-0">
                    {step.n}
                  </div>
                  <h3 className="mt-5 font-display text-xl font-semibold tracking-tight text-[var(--text-primary)]">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-[17px] leading-relaxed text-[var(--text-secondary)]">
                    {step.text}
                  </p>
                </Reveal>
              );
              if (i < steps.length - 1) {
                return [
                  block,
                  <div
                    key={`arrow-${step.n}`}
                    className="hidden items-center justify-center self-center pt-7 text-[var(--accent-secondary)] lg:flex"
                    aria-hidden
                  >
                    <span className="text-2xl font-light">→</span>
                  </div>,
                ];
              }
              return [block];
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
