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
  /** Центрировать микротекст (финальный CTA) */
  microCentered?: boolean;
  /** На узких экранах центрировать микротекст (hero) */
  centerMicroOnMobile?: boolean;
  /** Строка с галочками под формой (в финальном CTA — отдельная строка текста) */
  showMicroBullets?: boolean;
};

export function UrlForm({
  className,
  microCentered,
  centerMicroOnMobile,
  showMicroBullets = true,
}: UrlFormProps) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const normalized = normalizeUrl(value);
    if (!isValidUrl(normalized)) {
      setError("Проверьте адрес сайта");
      return;
    }
    router.push(`/scanning?url=${encodeURIComponent(normalized)}`);
  }

  return (
    <div className={cn("w-full", className)}>
      <form
        onSubmit={handleSubmit}
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
        />
        <Button type="submit" size="lg" className="shrink-0 sm:w-auto sm:min-w-[200px]">
          Проверить сайт
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
