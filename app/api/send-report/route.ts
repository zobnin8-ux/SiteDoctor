import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

import { buildEmailHtml } from "@/lib/emails/report-email";
import { supabaseAdmin } from "@/lib/supabase/server";

const FROM_EMAIL = "doctor@sitedoctor.live";
const FROM_NAME = "Site Doctor";
const MAX_EMAILS_PER_HOUR = 3;

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export async function POST(request: NextRequest) {
  try {
    const resend = getResend();
    if (!resend) {
      return NextResponse.json(
        { error: "Email не настроен на сервере" },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { email, scanId, scanUrl } = body as {
      email?: string;
      scanId?: string;
      scanUrl?: string;
    };

    if (
      !email ||
      typeof email !== "string" ||
      !email.includes("@") ||
      !email.includes(".")
    ) {
      return NextResponse.json({ error: "Некорректный email" }, { status: 400 });
    }

    if (!scanId || typeof scanId !== "string") {
      return NextResponse.json({ error: "Missing scanId" }, { status: 400 });
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = request.headers.get("user-agent") || "";

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    const { count, error: countError } = await supabaseAdmin
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("ip_address", ip)
      .gte("created_at", oneHourAgo);

    if (countError) {
      console.error("Rate limit count error:", countError);
    }

    if (count !== null && count >= MAX_EMAILS_PER_HOUR) {
      return NextResponse.json(
        { error: "Слишком много запросов. Попробуйте через час." },
        { status: 429 }
      );
    }

    const { data: scan, error: scanError } = await supabaseAdmin
      .from("scans")
      .select("id, url, normalized_url, scan_result")
      .eq("id", scanId)
      .single();

    if (scanError || !scan) {
      return NextResponse.json({ error: "Отчёт не найден" }, { status: 404 });
    }

    const { data: lead, error: leadError } = await supabaseAdmin
      .from("leads")
      .insert({
        scan_id: scanId,
        email,
        source: "report_email",
        scan_url: scanUrl || scan.url,
        ip_address: ip,
        user_agent: userAgent,
      })
      .select("id")
      .single();

    if (leadError || !lead) {
      console.error("Failed to create lead:", leadError);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }

    const reportUrl = `https://www.sitedoctor.live/report/${scanId}`;
    const html = buildEmailHtml({
      reportUrl,
      scanUrl: scan.url as string,
      scanResult: scan.scan_result,
    });

    try {
      const result = await resend.emails.send({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to: email,
        subject: `Диагностика сайта ${scan.url as string} — Site Doctor`,
        html,
        replyTo: FROM_EMAIL,
      });

      if (result.error) {
        console.error("Resend error:", result.error);

        await supabaseAdmin
          .from("leads")
          .update({
            email_sent: false,
            email_error: JSON.stringify(result.error),
          })
          .eq("id", lead.id);

        return NextResponse.json({ error: "Не удалось отправить" }, { status: 500 });
      }

      await supabaseAdmin
        .from("leads")
        .update({
          email_sent: true,
          email_sent_at: new Date().toISOString(),
          resend_id: result.data?.id ?? null,
        })
        .eq("id", lead.id);

      return NextResponse.json({ ok: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("Email send exception:", message);

      await supabaseAdmin
        .from("leads")
        .update({
          email_sent: false,
          email_error: message,
        })
        .eq("id", lead.id);

      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  } catch (e) {
    console.error("Send report API error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
