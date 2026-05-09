export const BRAND = {
  name: "Site Doctor",
  nameRu: "Site Doctor",
  domain: "sitedoctor.ai",
  tagline: "Диагностика сайтов",
  description: "AI-диагностика сайтов малого бизнеса за 60 секунд",
  contactTelegram: "@zobnin",
  contactEmail: "hi@sitedoctor.ai",
  parentBrand: "Zobnin AI",
  parentUrl: "https://zobnin.ai",
} as const;

/** Статичное число для MVP; позже — из БД */
export const SITES_SCANNED_DISPLAY = 1247;

/**
 * Hero на светлом лендинге. TODO: подменить на PNG с прозрачным фоном после обработки референса.
 * @see landing-spec-v2-addendum.md
 *
 * Доп. референсы (полные кадры до вырезки робота / финального арта):
 * - `/robot/ref-examination-live.png` — «WEBSITE EXAMINATION · LIVE SCAN», лупа над экраном
 * - `/robot/ref-diagnostic-xray.png` — «WEBSITE DIAGNOSTIC X-RAY REPORT», вайрфрейм и метрики
 * - `/robot/ref-consultation-health-check.png` — кабинет, клиенты, дашборд «Website Health Check», 56/100, слоган на стене SITE DOCTOR
 * - при необходимости подставьте один из них вместо `hero-robot.png` или используйте в макетах
 */
export const HERO_ROBOT_IMAGE = "/robot/hero-robot.png" as const;

export const SCANNING_ROBOT_IMAGE = "/robot/scanning-robot.png" as const;

export const REPORT_ROBOT_IMAGE = "/robot/report-robot.png" as const;
