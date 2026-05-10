"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { Check, Link as LinkIcon, Loader2, Mail } from "lucide-react";

type Props = {
  scanId: string;
  scanUrl: string;
  /** Если false — только копирование ссылки (например демо `/report/sample`). */
  enableEmail?: boolean;
};

export function ReportSaveBlock({
  scanId,
  scanUrl,
  enableEmail = true,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const reportUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://www.sitedoctor.live/report/${scanId}`;

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(reportUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setError(
        "Не удалось скопировать. Скопируйте ссылку вручную из адресной строки."
      );
    }
  }

  async function handleSendEmail(e: FormEvent) {
    e.preventDefault();

    if (!email.includes("@") || !email.includes(".")) {
      setError("Проверьте email");
      return;
    }

    setSending(true);
    setError("");

    try {
      const response = await fetch("/api/send-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, scanId, scanUrl }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as {
          error?: string;
        };

        if (response.status === 429) {
          setError("Слишком много запросов. Попробуйте через час.");
        } else {
          setError(data.error || "Не удалось отправить");
        }
        setSending(false);
        return;
      }

      setEmailSent(true);
      setSending(false);
    } catch {
      setError("Ошибка сети");
      setSending(false);
    }
  }

  return (
    <section className="my-12">
      <div className="mx-auto max-w-2xl px-6 md:px-0">
        <div
          className="rounded-2xl p-8 md:p-10"
          style={{
            border: "1px solid rgba(0, 212, 255, 0.15)",
            backgroundColor: "rgba(17, 24, 39, 0.6)",
          }}
        >
          <p
            className="mb-2 font-mono text-xs uppercase tracking-[0.2em]"
            style={{ color: "var(--accent-primary)" }}
          >
            Сохранить отчёт
          </p>
          <h3 className="font-display text-xl font-medium md:text-2xl">
            Этот отчёт всегда доступен по ссылке
          </h3>
          <p className="mb-6 text-sm text-[var(--text-secondary)]">
            Сохраните, чтобы вернуться позже или поделиться с партнёром.
          </p>

          {!showEmailForm && !emailSent && (
            <div className="flex flex-col gap-3 md:flex-row">
              <button
                type="button"
                onClick={handleCopyLink}
                disabled={copied}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-medium transition-all md:flex-none"
                style={{
                  backgroundColor: copied
                    ? "rgba(0, 229, 160, 0.15)"
                    : "rgba(0, 212, 255, 0.1)",
                  color: copied
                    ? "var(--accent-success, #00E5A0)"
                    : "var(--accent-primary)",
                  border: `1px solid ${copied ? "rgba(0, 229, 160, 0.4)" : "rgba(0, 212, 255, 0.3)"}`,
                }}
              >
                {copied ? (
                  <>
                    <Check size={16} />
                    Скопировано
                  </>
                ) : (
                  <>
                    <LinkIcon size={16} />
                    Скопировать ссылку
                  </>
                )}
              </button>

              {enableEmail ? (
                <button
                  type="button"
                  onClick={() => setShowEmailForm(true)}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-medium transition-all md:flex-none"
                  style={{
                    backgroundColor: "rgba(0, 212, 255, 0.1)",
                    color: "var(--accent-primary)",
                    border: "1px solid rgba(0, 212, 255, 0.3)",
                  }}
                >
                  <Mail size={16} />
                  Отправить на почту
                </button>
              ) : null}
            </div>
          )}

          {enableEmail && showEmailForm && !emailSent ? (
            <form onSubmit={handleSendEmail} className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
                disabled={sending}
                className="w-full rounded-lg px-4 py-3 font-mono text-base"
                style={{
                  backgroundColor: "rgba(10, 14, 26, 0.6)",
                  border: "1px solid rgba(0, 212, 255, 0.3)",
                  color: "var(--text-primary)",
                }}
              />

              <div className="flex flex-col gap-3 md:flex-row">
                <button
                  type="submit"
                  disabled={sending}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-medium transition-all"
                  style={{
                    backgroundColor: "var(--accent-primary)",
                    color: "#0A0E1A",
                  }}
                >
                  {sending ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Отправляем...
                    </>
                  ) : (
                    <>
                      <Mail size={16} />
                      Отправить
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowEmailForm(false);
                    setError("");
                  }}
                  disabled={sending}
                  className="rounded-lg px-5 py-3 text-sm font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text-secondary)]"
                >
                  Отмена
                </button>
              </div>
            </form>
          ) : null}

          {enableEmail && emailSent ? (
            <div
              className="flex items-center gap-3 rounded-lg px-4 py-3"
              style={{
                backgroundColor: "rgba(0, 229, 160, 0.1)",
                border: "1px solid rgba(0, 229, 160, 0.3)",
                color: "var(--accent-success, #00E5A0)",
              }}
            >
              <Check size={18} />
              <span className="text-sm">
                Отправили на <span className="font-mono">{email}</span>.
                Проверьте почту через минуту.
              </span>
            </div>
          ) : null}

          {error && (!enableEmail || !emailSent) ? (
            <p
              className="mt-3 text-sm"
              style={{ color: "var(--accent-secondary, #FF3B5C)" }}
            >
              {error}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
