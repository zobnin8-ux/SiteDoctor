const recentRequests = new Map<string, number>();
const COOLDOWN_MS = 30_000;

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const last = recentRequests.get(ip);

  if (last && now - last < COOLDOWN_MS) {
    return false;
  }

  recentRequests.set(ip, now);

  if (recentRequests.size > 1000) {
    recentRequests.forEach((time, key) => {
      if (now - time > COOLDOWN_MS) {
        recentRequests.delete(key);
      }
    });
  }

  return true;
}
