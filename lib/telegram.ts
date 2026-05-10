import { BRAND } from "./brand";

/** Telegram для контактов и CTA отчёта: Vercel `NEXT_PUBLIC_CONTACT_TELEGRAM`, иначе `BRAND.contactTelegram`. */
function telegramRaw(): string {
  const fromEnv =
    typeof process.env.NEXT_PUBLIC_CONTACT_TELEGRAM === "string"
      ? process.env.NEXT_PUBLIC_CONTACT_TELEGRAM.trim()
      : "";
  return fromEnv || BRAND.contactTelegram;
}

/** Ссылка на Telegram из плейсхолдера @username или полного URL */
export function telegramHref(): string {
  const t = telegramRaw().trim();
  if (!t) return "#";
  if (t.startsWith("http://") || t.startsWith("https://")) return t;
  const handle = t.replace(/^@/, "");
  return `https://t.me/${handle}`;
}

/** Открыть Telegram в новой вкладке — текущая страница отчёта остаётся открытой. */
export const telegramLinkNewTabProps = {
  target: "_blank",
  rel: "noopener noreferrer",
} as const;
