/** Построение модели отчёта из строки `scans` + `scan_result` (воркер). */

export type DiagnosisStatus = "critical" | "warning" | "ok";

export type ScanResultSnapshot = {
  final_url: string;
  title: string;
  description: string | null;
  h1: string[];
  word_count: number;
  form_count: number;
  contact_link_count: number;
};

/** Успешный скан v1 или v2 (совместимые поля эвристик). */
export type ScanResultSuccessRow = {
  version: 1 | 2;
  status: "success";
  scanned_at: string;
  input_url: string;
  desktop: ScanResultSnapshot;
  mobile: ScanResultSnapshot;
  trust_notes: string[];
  desktop_screenshot_url?: string | null;
  mobile_screenshot_url?: string | null;
  ai_failed?: boolean;
  ai_error?: string | null;
  ai_analysis?: AiAnalysisPayload;
};

/** Payload AI из `scan_result` v2 (зеркало воркера). */
export type AiAnalysisPayload = {
  industry: string;
  industry_label: string;
  industry_confidence: number;
  scores: {
    overall: number;
    trust: number;
    cta: number;
    clarity: number;
    mobile: number;
    visual: number;
  };
  diagnosis: {
    summary: string;
    verdict: string;
  };
  top_issues: Array<{
    id: number;
    title: string;
    severity: "critical" | "warning" | "minor";
    description: string;
  }>;
  fixes: {
    hero_before: string | null;
    hero_after: string | null;
    cta_before: string | null;
    cta_after: string | null;
    about_before: string | null;
    about_after: string | null;
  };
  model?: string;
  tokens_used?: { input: number; output: number };
  generated_at?: string;
};

export type ReportKind = "heuristic" | "ai";

export type ReportViewModel = {
  hostname: string;
  completedLabel: string;
  desktopShot: string | null;
  mobileShot: string | null;
  score: number;
  scoreVerdict: string;
  diagnosis: { id: string; label: string; status: DiagnosisStatus }[];
  topIssues: {
    id: string;
    severity: "critical" | "warning" | "minor";
    title: string;
    description: string;
  }[];
  sampleFix: { before: string; after: string };
  reportKind: ReportKind;
  aiUnavailableBanner?: boolean;
  industryLabel?: string;
  aiSummary?: string;
  subScores?: {
    overall: number;
    trust: number;
    cta: number;
    clarity: number;
    mobile: number;
    visual: number;
  };
};

function parseHostname(url: string): string {
  try {
    const u = new URL(url.startsWith("http") ? url : `https://${url}`);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return url.slice(0, 48);
  }
}

function formatRuDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10);
  return d.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function httpsOk(snapshot: ScanResultSnapshot): boolean {
  try {
    return new URL(snapshot.final_url).protocol === "https:";
  } catch {
    return false;
  }
}

function clampScore(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function verdictForScore(score: number): string {
  if (score >= 75) return "Есть сильные стороны, точечные улучшения дадут заметный эффект";
  if (score >= 55) return "Есть заметные пробелы — стоит заняться приоритетными блоками";
  return "Есть критичные зоны внимания на главной странице";
}

function labelStatus(ok: boolean, warnIfFalse: boolean): DiagnosisStatus {
  if (ok) return "ok";
  return warnIfFalse ? "warning" : "critical";
}

function buildHeuristicDiagnosisAndScore(sr: ScanResultSuccessRow): {
  score: number;
  diagnosis: ReportViewModel["diagnosis"];
  topIssues: ReportViewModel["topIssues"];
  sampleFix: ReportViewModel["sampleFix"];
  scoreVerdict: string;
} {
  const d = sr.desktop;
  const m = sr.mobile;
  const notes = sr.trust_notes ?? [];

  let score = 52;
  if (httpsOk(d)) score += 14;
  else score -= 12;

  if (d.description && d.description.trim().length > 0) score += 10;
  else score -= 8;

  if (d.h1.length === 1) score += 10;
  else if (d.h1.length === 0) score -= 14;
  else score -= 4;

  const contacts = d.contact_link_count + m.contact_link_count;
  if (contacts > 0) score += 6;

  if (d.form_count > 0 || m.form_count > 0) score += 6;

  const wc = Math.min(d.word_count, m.word_count);
  if (wc >= 120) score += 5;
  else if (wc < 40) score -= 6;

  score = Math.max(14, Math.min(96, Math.round(score)));

  const diagnosis: ReportViewModel["diagnosis"] = [
    {
      id: "https",
      label: "HTTPS и безопасность входа",
      status: labelStatus(httpsOk(d), true),
    },
    {
      id: "meta",
      label: "Meta description для поиска",
      status: labelStatus(
        !!(d.description && d.description.trim().length > 0),
        true
      ),
    },
    {
      id: "h1",
      label: "Заголовок H1 и ясность темы",
      status:
        d.h1.length === 1 ? "ok" : d.h1.length === 0 ? "critical" : "warning",
    },
    {
      id: "contacts",
      label: "Контакты (телефон / email)",
      status: contacts > 0 ? "ok" : "warning",
    },
    {
      id: "forms",
      label: "Формы и заявки на главной",
      status: d.form_count + m.form_count > 0 ? "ok" : "warning",
    },
    {
      id: "content",
      label: "Объём полезного текста на главной",
      status: wc >= 120 ? "ok" : wc >= 60 ? "warning" : "critical",
    },
  ];

  const topIssues = notes.slice(0, 3).map((note, i) => {
    const lower = note.toLowerCase();
    const critical =
      lower.includes("без https") ||
      lower.includes("не найден h1") ||
      lower.includes("нет meta");
    return {
      id: `n-${i + 1}`,
      severity: critical ? ("critical" as const) : ("warning" as const),
      title: note.length > 72 ? `${note.slice(0, 69).trim()}…` : note,
      description: note,
    };
  });

  const sampleFix = buildSampleFix(d, notes);

  return {
    score,
    diagnosis,
    topIssues,
    sampleFix,
    scoreVerdict: verdictForScore(score),
  };
}

function buildSampleFix(
  desktop: ScanResultSnapshot,
  notes: string[]
): { before: string; after: string } {
  const title = desktop.title?.trim() || "Главная страница";
  const noDesc =
    !desktop.description?.trim() ||
    notes.some((n) => n.includes("Нет meta description"));
  const noH1 =
    desktop.h1.length === 0 || notes.some((n) => n.includes("Не найден H1"));

  if (noDesc) {
    return {
      before: title,
      after: `${title} — кратко: услуга, город, следующий шаг (запись / звонок). Meta description 150–160 символов.`,
    };
  }
  if (noH1) {
    return {
      before: "Тема главной не выделена одним заголовком H1",
      after: "Один H1: кто вы и какую проблему решаете за одно предложение.",
    };
  }
  return {
    before: "Общие формулировки без следующего шага",
    after: "Чёткий заголовок + один основной CTA: что получит клиент после клика.",
  };
}

function pickAiSampleFix(fixes: AiAnalysisPayload["fixes"]): {
  before: string;
  after: string;
} {
  const dash = "—";
  if (fixes.hero_after?.trim() || fixes.hero_before?.trim()) {
    return {
      before: fixes.hero_before?.trim() || dash,
      after: fixes.hero_after?.trim() || fixes.cta_after?.trim() || dash,
    };
  }
  if (fixes.cta_after?.trim() || fixes.cta_before?.trim()) {
    return {
      before: fixes.cta_before?.trim() || dash,
      after: fixes.cta_after?.trim() || dash,
    };
  }
  if (fixes.about_after?.trim() || fixes.about_before?.trim()) {
    return {
      before: fixes.about_before?.trim() || dash,
      after: fixes.about_after?.trim() || dash,
    };
  }
  return { before: dash, after: dash };
}

function mapAiTopIssues(
  issues: AiAnalysisPayload["top_issues"]
): ReportViewModel["topIssues"] {
  return issues.map((issue) => ({
    id: String(issue.id),
    severity: issue.severity,
    title: issue.title,
    description: issue.description,
  }));
}

export function buildReportViewModel(row: {
  url: string;
  completed_at: string | null;
  desktop_screenshot_url?: string | null;
  mobile_screenshot_url?: string | null;
  scan_result: unknown;
}): ReportViewModel | null {
  const sr = row.scan_result as ScanResultSuccessRow | null;
  if (!sr || sr.status !== "success") return null;
  if (sr.version !== 1 && sr.version !== 2) return null;

  const hostname = parseHostname(row.url);
  const completedLabel = formatRuDate(row.completed_at ?? sr.scanned_at);
  const desktopShot =
    row.desktop_screenshot_url ?? sr.desktop_screenshot_url ?? null;
  const mobileShot =
    row.mobile_screenshot_url ?? sr.mobile_screenshot_url ?? null;

  const heuristic = buildHeuristicDiagnosisAndScore(sr);

  if (sr.version === 2 && sr.ai_failed) {
    return {
      hostname,
      completedLabel,
      desktopShot,
      mobileShot,
      score: heuristic.score,
      scoreVerdict: heuristic.scoreVerdict,
      diagnosis: heuristic.diagnosis,
      topIssues: heuristic.topIssues,
      sampleFix: heuristic.sampleFix,
      reportKind: "heuristic",
      aiUnavailableBanner: true,
    };
  }

  if (
    sr.version === 2 &&
    !sr.ai_failed &&
    sr.ai_analysis &&
    typeof sr.ai_analysis === "object"
  ) {
    const ai = sr.ai_analysis;
    const overall = clampScore(ai.scores.overall);

    return {
      hostname,
      completedLabel,
      desktopShot,
      mobileShot,
      score: overall,
      scoreVerdict: ai.diagnosis.verdict,
      diagnosis: [],
      topIssues: mapAiTopIssues(ai.top_issues),
      sampleFix: pickAiSampleFix(ai.fixes),
      reportKind: "ai",
      industryLabel: ai.industry_label,
      aiSummary: ai.diagnosis.summary,
      subScores: {
        overall,
        trust: clampScore(ai.scores.trust),
        cta: clampScore(ai.scores.cta),
        clarity: clampScore(ai.scores.clarity),
        mobile: clampScore(ai.scores.mobile),
        visual: clampScore(ai.scores.visual),
      },
    };
  }

  if (sr.version === 1) {
    return {
      hostname,
      completedLabel,
      desktopShot,
      mobileShot,
      score: heuristic.score,
      scoreVerdict: heuristic.scoreVerdict,
      diagnosis: heuristic.diagnosis,
      topIssues: heuristic.topIssues,
      sampleFix: heuristic.sampleFix,
      reportKind: "heuristic",
    };
  }

  return {
    hostname,
    completedLabel,
    desktopShot,
    mobileShot,
    score: heuristic.score,
    scoreVerdict: heuristic.scoreVerdict,
    diagnosis: heuristic.diagnosis,
    topIssues: heuristic.topIssues,
    sampleFix: heuristic.sampleFix,
    reportKind: "heuristic",
    aiUnavailableBanner: true,
  };
}
