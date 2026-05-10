/** Человекочитаемая строка из неизвестной ошибки (в т.ч. PostgREST без instanceof Error). */
export function formatError(err: unknown): string {
  if (err instanceof Error && err.message) {
    return err.message;
  }
  if (err && typeof err === "object") {
    const o = err as Record<string, unknown>;
    const code = typeof o.code === "string" ? o.code : "";
    const msg = typeof o.message === "string" ? o.message : "";
    const hint = typeof o.hint === "string" ? o.hint : "";
    if (code && msg) {
      return hint ? `${code}: ${msg} (${hint})` : `${code}: ${msg}`;
    }
    if (msg) return msg;
    try {
      return JSON.stringify(err);
    } catch {
      /* fallthrough */
    }
  }
  return String(err);
}
