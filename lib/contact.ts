import { BRAND } from "@/lib/brand";
import { telegramHref } from "@/lib/telegram";

/**
 * «Получить полный отчёт» — пока это лид в Telegram (нет paywall / автовыдачи PDF).
 * URL тот же, что у общего контакта; username задаётся в `NEXT_PUBLIC_CONTACT_TELEGRAM` или `BRAND.contactTelegram`.
 */
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
