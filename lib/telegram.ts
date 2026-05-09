import { BRAND } from "./brand";

/** Ссылка на Telegram из плейсхолдера @username или полного URL */
export function telegramHref(): string {
  const t = BRAND.contactTelegram.trim();
  if (!t || t === "[TELEGRAM]") return "#";
  if (t.startsWith("http://") || t.startsWith("https://")) return t;
  const handle = t.replace(/^@/, "");
  return `https://t.me/${handle}`;
}
