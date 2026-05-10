"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "@/components/landing/motion";

const faqItems = [
  {
    q: "А вы не украдёте мой сайт или мои данные?",
    a: "Нет. Мы открываем сайт так же, как любой посетитель из браузера — никакого доступа изнутри нам не нужно. Анализируем только то, что видно публично каждому, кто зашёл по ссылке.",
  },
  {
    q: "Чем это отличается от обычного SEO-аудита?",
    a: "SEO-аудит проверяет, видит ли вас Google. Мы проверяем другое — понимает ли вас клиент, который уже зашёл на сайт. Это разные вещи, и обычно проблема именно во втором: люди приходят, но не покупают.",
  },
  {
    q: "Что входит в отчёт?",
    a: "Общий балл и вердикт, список проблем по важности и объяснение простым языком — на основе того, что видно на главной и в скриншотах десктопа и мобилы. При AI-разборе добавляются оценки по направлениям и сводка. Это страница по ссылке: её можно сохранить или отправить себе на почту. Отдельного PDF мы не выдаём.",
  },
  {
    q: "А вы можете переделать сайт целиком?",
    a: "Да. Если после диагноза вы поймёте, что проще не чинить, а переделать — напишите, обсудим. Это уже отдельная услуга.",
  },
  {
    q: "Какие сайты вы можете проверить?",
    a: "Любые публичные сайты на любом конструкторе: Tilda, WordPress, Webflow, Squarespace, Wix, самописные. Главное — чтобы сайт был доступен по ссылке.",
  },
  {
    q: "Сколько ждать результата?",
    a: "Обычно до минуты: пока откроется сайт, снимутся экраны и соберётся отчёт. Готовую страницу с результатами вы открываете сразу по ссылке — без отдельной оплаты.",
  },
  {
    q: "Что если мой сайт получит низкую оценку?",
    a: "Это нормально и даже полезно. Низкая оценка — это карта действий: видно, что чинить и в каком порядке. Большинство сайтов малого бизнеса получают 30–55 баллов из 100, и это не катастрофа, а отправная точка.",
  },
] as const;

export function Faq() {
  return (
    <section className="py-16 lg:py-24" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <h2
            id="faq-heading"
            className="font-display text-[28px] font-semibold tracking-tight text-[var(--text-primary)] sm:text-[32px] lg:text-[40px] xl:text-[48px]"
          >
            Частые вопросы
          </h2>
        </Reveal>

        <Reveal delay={0.08} className="mt-10">
          <Accordion type="single" collapsible className="space-y-3">
            {faqItems.map((item, i) => (
              <AccordionItem
                key={item.q}
                value={`item-${i}`}
                className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 shadow-card"
              >
                <AccordionTrigger className="py-0 hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-[17px] leading-relaxed">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
