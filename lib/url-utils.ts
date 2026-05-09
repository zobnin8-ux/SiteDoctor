/**
 * Убирает пробелы, при необходимости добавляет https://
 */
export function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

/**
 * Проверка через URL после нормализации (исключаем пустой host)
 */
export function isValidUrl(normalized: string): boolean {
  if (!normalized) return false;
  try {
    const u = new URL(normalized);
    return Boolean(u.hostname && u.hostname.includes("."));
  } catch {
    return false;
  }
}
