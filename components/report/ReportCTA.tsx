import { BRAND } from "@/lib/brand";
import { fullReportHref } from "@/lib/contact";

export function ReportCTA() {
  const tg = BRAND.contactTelegram.replace(/^@/, "");

  return (
    <section className="my-16 bg-[#fafaf7] py-16 text-[#1a1a1a]">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <p className="mb-4 text-sm uppercase tracking-wider text-[#9a9a9a]">
          Это бесплатная версия
        </p>
        <h3 className="font-display text-2xl md:text-3xl">
          В полном отчёте — все 12 проблем, готовые тексты для всей главной
          страницы и SEO-теги
        </h3>
        <a
          href={fullReportHref()}
          className="mt-6 inline-flex rounded-xl bg-[#e53e3e] px-8 py-4 text-lg font-medium text-white hover:opacity-95"
        >
          Получить полный отчёт
        </a>
        <p className="mt-6">
          <a
            href={`https://t.me/${tg}`}
            className="text-[#00b8d9] hover:underline"
          >
            → Хочу чтобы вы переделали сайт
          </a>
        </p>
      </div>
    </section>
  );
}
