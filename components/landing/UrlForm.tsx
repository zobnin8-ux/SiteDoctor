"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isValidUrl, normalizeUrl } from "@/lib/url-utils";
import { cn } from "@/lib/utils";

type UrlFormProps = {
  className?: string;
  microCentered?: boolean;
  centerMicroOnMobile?: boolean;
  showMicroBullets?: boolean;
  /** POST `/api/scan` → `/scanning/[id]` (Спринт 1). Если false — только legacy-редирект (не используется). */
  createScan?: boolean;
};

export function UrlForm({
  className,
  microCentered,
  centerMicroOnMobile,
  showMicroBullets = true,
  createScan = true,
}: UrlFormProps) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const normalized = normalizeUrl(value);
    if (!isValidUrl(normalized)) {
      setError("Проверьте адрес сайта");
      return;
    }

    if (!createScan) {
      router.push(`/scanning?url=${encodeURIComponent(normalized)}`);
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: normalized }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as {
          error?: string;
        };

        if (response.status === 429) {
          setError(
            data.error ||
              "Слишком много проверок с вашего подключения. Попробуйте позже."
          );
        } else {
          setError(data.error || "Не удалось начать сканирование");
        }
        setSubmitting(false);
        return;
      }

      const { scanId } = (await response.json()) as { scanId?: string };
      if (!scanId) {
        setError("Не удалось начать сканирование");
        setSubmitting(false);
        return;
      }

      fetch("/api/scan-count", { method: "POST" }).catch(() => {});
      router.push(`/scanning/${scanId}`);
    } catch {
      setError("Ошибка сети. Проверьте соединение.");
      setSubmitting(false);
    }
  }

  return (
    <div className={cn("w-full", className)}>
      <form
        onSubmit={(e) => void handleSubmit(e)}
        className="flex w-full flex-col gap-3 sm:flex-row sm:items-stretch"
      >
        <Input
          type="text"
          inputMode="url"
          autoComplete="url"
          placeholder="vashsite.ru"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(null);
          }}
          className="min-w-0 flex-1"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "url-error" : undefined}
          disabled={submitting}
        />
        <Button
          type="submit"
          size="lg"
          className="shrink-0 sm:w-auto sm:min-w-[200px]"
          disabled={submitting}
        >
          {submitting ? "Отправка…" : "Проверить сайт"}
        </Button>
      </form>
      {error ? (
        <p id="url-error" className="mt-2 text-sm text-[var(--danger)]" role="alert">
          {error}
        </p>
      ) : null}
      {showMicroBullets ? (
        <div
          className={cn(
            "mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--text-muted)]",
            microCentered && "justify-center",
            centerMicroOnMobile && "max-sm:justify-center"
          )}
        >
          <span className="inline-flex items-center gap-1.5">
            <Check className="h-4 w-4 text-[var(--accent-tech)]" aria-hidden />
            Бесплатно
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Check className="h-4 w-4 text-[var(--accent-tech)]" aria-hidden />
            Без регистрации
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Check className="h-4 w-4 text-[var(--accent-tech)]" aria-hidden />
            Результат через минуту
          </span>
        </div>
      ) : null}
    </div>
  );
}
