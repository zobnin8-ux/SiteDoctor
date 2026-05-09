/**
 * Базовый URL сайта для metadata (OG / Twitter) и абсолютных ссылок.
 * На Vercel: задайте NEXT_PUBLIC_SITE_URL при кастомном домене.
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "https://site-doctor-orcin.vercel.app";
}
