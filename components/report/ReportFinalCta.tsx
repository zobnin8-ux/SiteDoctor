"use client";

import { ArrowRight } from "lucide-react";

import { telegramHref } from "@/lib/telegram";

const INSTAGRAM_URL = "https://instagram.com/zobnin.ai";
const ZOBNIN_TECH_URL = "https://zobnin.tech";
const SITEDOCTOR_URL = "https://sitedoctor.live";

/** Светлый CTA после диагностики: услуга переделки сайта (не зависит от палитры dark-zone). */
export function ReportFinalCta() {
  return (
    <section
      className="my-16 w-full px-4 py-16 sm:px-6 md:py-20 lg:px-8"
      style={{ backgroundColor: "#FAFAF7" }}
    >
      <div className="mx-auto max-w-3xl">
        <div
          className="rounded-3xl bg-white p-8 md:p-12"
          style={{
            boxShadow: "0 24px 60px rgba(0, 0, 0, 0.15)",
            color: "#1A1A1A",
          }}
        >
          <p
            className="mb-4 text-xs font-medium uppercase tracking-[0.2em]"
            style={{ color: "#9A9A9A" }}
          >
            Это бесплатная диагностика
          </p>

          <h2
            className="font-display mb-6 text-4xl font-semibold md:text-5xl"
            style={{ color: "#1A1A1A", letterSpacing: "-0.02em" }}
          >
            Это поправимо.
          </h2>

          <p
            className="mb-6 text-lg leading-relaxed"
            style={{ color: "#5C5C5C" }}
          >
            Я могу переделать ваш сайт по этому отчёту — переписать тексты,
            перестроить структуру, заменить всё что мешает конверсии.
          </p>

          <p
            className="mb-8 text-lg font-semibold leading-relaxed"
            style={{ color: "#1A1A1A" }}
          >
            Через 5–10 дней у вас будет здоровый сайт, который продаёт.
          </p>

          <ul className="mb-8 space-y-3">
            <li
              className="flex items-start gap-3 text-[15px] leading-snug"
              style={{ color: "#5C5C5C" }}
            >
              <span className="shrink-0" style={{ color: "#E53E3E" }}>
                ✦
              </span>
              <span>Тексты, структура, дизайн</span>
            </li>
            <li
              className="flex items-start gap-3 text-[15px] leading-snug"
              style={{ color: "#5C5C5C" }}
            >
              <span className="shrink-0" style={{ color: "#E53E3E" }}>
                ✦
              </span>
              <span>Адаптивная вёрстка</span>
            </li>
            <li
              className="flex items-start gap-3 text-[15px] leading-snug"
              style={{ color: "#5C5C5C" }}
            >
              <span className="shrink-0" style={{ color: "#E53E3E" }}>
                ✦
              </span>
              <span>AI-подход к конверсии</span>
            </li>
          </ul>

          <div
            className="mb-10 border-l-2 pl-4"
            style={{ borderColor: "#E53E3E" }}
          >
            <p
              className="font-mono text-[17px] font-medium leading-relaxed"
              style={{ color: "#1A1A1A" }}
            >
              От $300 за точечные правки
              <br />
              до $1500 за переделку под ключ
            </p>
          </div>

          <div className="mb-10 flex flex-col gap-3 md:flex-row md:gap-4">
            <a
              href={telegramHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 w-full flex-1 items-center justify-center gap-2 rounded-xl bg-[#E53E3E] px-8 text-base font-medium text-white transition-all hover:scale-[1.02] hover:bg-[#C53030] active:scale-[0.98] md:w-auto md:flex-none"
            >
              Написать в Telegram
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 w-full flex-1 items-center justify-center gap-2 rounded-xl border-2 border-[#E53E3E] bg-white px-8 text-base font-medium text-[#1A1A1A] transition-all hover:scale-[1.02] hover:bg-[#FFF5F5] hover:text-[#E53E3E] active:scale-[0.98] md:w-auto md:flex-none"
            >
              Instagram
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
            </a>
          </div>

          <p className="text-[13px]" style={{ color: "#9A9A9A" }}>
            Примеры работ:{" "}
            <a
              href={ZOBNIN_TECH_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#5C5C5C] transition-colors hover:text-[#E53E3E]"
            >
              zobnin.tech
            </a>
            {" · "}
            <a
              href={SITEDOCTOR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#5C5C5C] transition-colors hover:text-[#E53E3E]"
            >
              sitedoctor.live
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
