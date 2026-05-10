interface EmailParams {
  reportUrl: string;
  scanUrl: string;
  scanResult?: unknown;
}

export function buildEmailHtml(params: EmailParams): string {
  const { reportUrl, scanUrl, scanResult } = params;

  const sr = scanResult as Record<string, unknown> | undefined;
  const ai = sr?.ai_analysis as Record<string, unknown> | undefined;
  const scores = ai?.scores as Record<string, unknown> | undefined;
  const overallScore =
    typeof scores?.overall === "number" ? scores.overall : undefined;
  const diagnosis = ai?.diagnosis as Record<string, unknown> | undefined;
  const verdict =
    typeof diagnosis?.verdict === "string" ? diagnosis.verdict : undefined;
  const topIssues = ai?.top_issues as Array<Record<string, unknown>> | undefined;
  const topIssue = topIssues?.[0];

  const previewHtml =
    ai && overallScore !== undefined
      ? `
    <div style="background: #F4F2ED; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center;">
      <div style="font-size: 14px; color: #9A9A9A; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">
        Общий балл
      </div>
      <div style="font-size: 56px; font-weight: 600; color: #1A1A1A; line-height: 1; margin-bottom: 4px;">
        ${overallScore}<span style="font-size: 28px; color: #9A9A9A;">/100</span>
      </div>
      ${verdict ? `<div style="font-size: 14px; color: #5C5C5C; margin-top: 8px;">${escapeHtml(verdict)}</div>` : ""}
    </div>
  `
      : "";

  const desc =
    typeof topIssue?.description === "string" ? topIssue.description : "";
  const title =
    typeof topIssue?.title === "string" ? topIssue.title : undefined;

  const topIssueHtml =
    topIssue && title
      ? `
    <div style="border-left: 3px solid #E53E3E; padding-left: 16px; margin: 24px 0;">
      <div style="font-size: 12px; color: #E53E3E; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600; margin-bottom: 4px;">
        Главная проблема
      </div>
      <div style="font-size: 17px; font-weight: 600; color: #1A1A1A; margin-bottom: 8px;">
        ${escapeHtml(title)}
      </div>
      <div style="font-size: 14px; color: #5C5C5C; line-height: 1.5;">
        ${escapeHtml(desc.slice(0, 200))}${desc.length > 200 ? "..." : ""}
      </div>
    </div>
  `
      : "";

  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Диагностика сайта ${escapeHtml(scanUrl)}</title>
</head>
<body style="margin: 0; padding: 0; background: #FAFAF7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #FAFAF7;">
    <tr>
      <td align="center" style="padding: 40px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 560px; background: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);">

          <tr>
            <td style="padding: 32px 40px 24px; border-bottom: 1px solid #E8E5DE;">
              <div style="display: inline-block;">
                <div style="font-family: 'Unbounded', -apple-system, sans-serif; font-size: 20px; font-weight: 600; color: #1A1A1A; letter-spacing: -0.02em;">
                  Site Doctor
                </div>
                <div style="font-size: 12px; color: #9A9A9A; margin-top: 2px;">
                  Диагностика сайтов малого бизнеса
                </div>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding: 40px;">

              <p style="font-size: 12px; color: #9A9A9A; text-transform: uppercase; letter-spacing: 0.2em; margin: 0 0 12px;">
                Diagnostic Report
              </p>

              <h1 style="font-family: 'Unbounded', -apple-system, sans-serif; font-size: 28px; font-weight: 600; color: #1A1A1A; line-height: 1.2; margin: 0 0 24px; letter-spacing: -0.02em;">
                Ваш отчёт по<br>
                <span style="color: #00B8D9; font-family: 'JetBrains Mono', monospace; font-size: 22px;">${escapeHtml(scanUrl)}</span>
              </h1>

              <p style="font-size: 16px; color: #5C5C5C; line-height: 1.6; margin: 0 0 8px;">
                Здравствуйте!
              </p>

              <p style="font-size: 16px; color: #5C5C5C; line-height: 1.6; margin: 0 0 24px;">
                Сохраняем для вас отчёт о диагностике сайта. Он всегда доступен по ссылке ниже — возвращайтесь когда удобно, пересылайте партнёру или дизайнеру.
              </p>

              ${previewHtml}

              ${topIssueHtml}

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 32px 0 0;">
                <tr>
                  <td align="center">
                    <a href="${reportUrl}" style="display: inline-block; padding: 16px 32px; background: #E53E3E; color: #FFFFFF; text-decoration: none; border-radius: 12px; font-weight: 500; font-size: 16px;">
                      Открыть полный отчёт →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="font-size: 13px; color: #9A9A9A; text-align: center; margin: 16px 0 0;">
                Или скопируйте ссылку:<br>
                <a href="${reportUrl}" style="color: #00B8D9; text-decoration: none; word-break: break-all; font-family: 'JetBrains Mono', monospace; font-size: 12px;">
                  ${reportUrl}
                </a>
              </p>

            </td>
          </tr>

          <tr>
            <td style="padding: 0 40px 32px;">
              <div style="border-top: 1px solid #E8E5DE; padding-top: 24px; font-size: 14px; color: #5C5C5C; line-height: 1.6;">
                <p style="margin: 0 0 8px;">
                  Если хотите чтобы я починил сайт по этому отчёту — напишите в Telegram или Instagram, обсудим.
                </p>
                <p style="margin: 0;">
                  <a href="https://t.me/A_nubi_ss" style="color: #E53E3E; text-decoration: none;">@A_nubi_ss</a>
                  &nbsp;·&nbsp;
                  <a href="https://instagram.com/zobnin.ai" style="color: #E53E3E; text-decoration: none;">@zobnin.ai</a>
                </p>
                <p style="margin: 16px 0 0; font-size: 13px; color: #9A9A9A; font-style: italic;">
                  — Dr. Site Doctor
                </p>
              </div>
            </td>
          </tr>

        </table>

        <p style="font-size: 12px; color: #9A9A9A; margin: 24px 0 0; text-align: center; max-width: 560px;">
          Это письмо отправлено потому что вы запросили его на сайте
          <a href="https://www.sitedoctor.live" style="color: #9A9A9A;">sitedoctor.live</a>.
          Если вы не запрашивали — просто проигнорируйте, мы больше не напишем.
        </p>

      </td>
    </tr>
  </table>
</body>
</html>`;
}

function escapeHtml(text?: string): string {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
