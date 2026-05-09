import { BRAND } from "@/lib/brand";
import { telegramHref } from "@/lib/telegram";

/** MVP: кнопка «полный отчёт» без оплаты — в Telegram или почту */
export function fullReportHref(): string {
  return telegramHref();
}

export function fullReportMailto(): string {
  const subject = encodeURIComponent("Полный отчёт Site Doctor");
  return `mailto:${BRAND.contactEmail}?subject=${subject}`;
}
