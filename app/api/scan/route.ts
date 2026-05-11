import { NextRequest, NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { isValidUrl, normalizeUrl } from "@/lib/url-utils";

function readIntEnv(name: string, defaultValue: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return defaultValue;
  const n = Number(raw);
  return Number.isFinite(n) ? n : defaultValue;
}

/** Сколько часов смотрим назад при подсчёте (по умолчанию 1). */
const RATE_LIMIT_HOURS = Math.max(1, readIntEnv("SCAN_RATE_LIMIT_WINDOW_HOURS", 1));
/**
 * Макс. новых сканов с одного IP за окно (по умолчанию 2 — разумно при платной рекламе).
 * В Vercel: `MAX_SCANS_PER_IP_PER_HOUR=1` для жёстче (1 раз в час).
 * `0` = без лимита (только если явно `SCAN_RATE_LIMIT_DISABLED=true` не выставлен — см. ниже).
 */
const MAX_SCANS_PER_IP_PER_HOUR = Math.max(0, readIntEnv("MAX_SCANS_PER_IP_PER_HOUR", 2));
const RATE_LIMIT_DISABLED =
  process.env.SCAN_RATE_LIMIT_DISABLED === "true" ||
  MAX_SCANS_PER_IP_PER_HOUR === 0;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { url } = body as { url?: string };

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const normalized = normalizeUrl(url);
    if (!isValidUrl(normalized)) {
      return NextResponse.json({ error: "Некорректный URL" }, { status: 400 });
    }

    const blockedPatterns = ["localhost", "127.0.0.1", "0.0.0.0", "::1"];
    const internalIpRegex =
      /(?:^|\/\/)(?:10\.|192\.168\.|172\.(?:1[6-9]|2[0-9]|3[0-1])\.)/;

    const lower = normalized.toLowerCase();
    if (
      blockedPatterns.some((p) => lower.includes(p)) ||
      internalIpRegex.test(normalized)
    ) {
      return NextResponse.json(
        { error: "Внутренние URL не поддерживаются" },
        { status: 400 }
      );
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = request.headers.get("user-agent") || "";

    if (!RATE_LIMIT_DISABLED) {
      const windowStart = new Date(
        Date.now() - RATE_LIMIT_HOURS * 60 * 60 * 1000
      ).toISOString();

      const { count, error: countError } = await supabaseAdmin
        .from("scans")
        .select("id", { count: "exact", head: true })
        .eq("ip_address", ip)
        .gte("created_at", windowStart);

      if (countError) {
        console.error("Rate limit check failed:", countError);
      } else if (count !== null && count >= MAX_SCANS_PER_IP_PER_HOUR) {
        const windowLabel =
          RATE_LIMIT_HOURS === 1
            ? "за последний час"
            : `за последние ${RATE_LIMIT_HOURS} ч.`;
        return NextResponse.json(
          {
            error: `С этого адреса уже запущено максимум проверок (${MAX_SCANS_PER_IP_PER_HOUR}) ${windowLabel}. Попробуйте позже.`,
          },
          { status: 429 }
        );
      }
    }

    const { data, error } = await supabaseAdmin
      .from("scans")
      .insert({
        url,
        normalized_url: normalized,
        status: "pending",
        progress: 0,
        current_step: "В очереди",
        ip_address: ip,
        user_agent: userAgent,
      })
      .select("id")
      .single();

    if (error || !data) {
      console.error("Failed to create scan:", error);
      return NextResponse.json(
        { error: "Не удалось создать сканирование" },
        { status: 500 }
      );
    }

    return NextResponse.json({ scanId: data.id });
  } catch (e) {
    console.error("Scan API error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
