import { BRAND } from "@/lib/brand";
import { telegramHref } from "@/lib/telegram";

/** Полный отчёт — пока Telegram */
export function fullReportHref(): string {
  return telegramHref();
}

export function fullReportMailto(): string {
  const subject = encodeURIComponent("Полный отчёт Site Doctor");
  const body = encodeURIComponent(
    "Здравствуйте! Хочу получить полный отчёт по сайту: "
  );
  return `mailto:${BRAND.contactEmail}?subject=${subject}&body=${body}`;
}
