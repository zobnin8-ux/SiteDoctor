/** Демо-отчёт `/report/sample` — статика из ТЗ */

export const SAMPLE_REPORT = {
  patient: "example-stomatology.ru",
  date: "09.05.2026",
  score: 42,
  scoreVerdict: "Требует серьёзного вмешательства",
  diagnosis: [
    { id: 1, label: "Clear Value Proposition", status: "critical" as const },
    { id: 2, label: "Strong CTA", status: "critical" as const },
    { id: 3, label: "Mobile Optimization", status: "warning" as const },
    { id: 4, label: "Page Speed", status: "warning" as const },
    { id: 5, label: "Trust Signals", status: "critical" as const },
    { id: 6, label: "SEO Structure", status: "ok" as const },
  ],
  topIssues: [
    {
      id: 1,
      severity: "critical" as const,
      title: "Непонятно, чем вы занимаетесь",
      description:
        "Зашёл на главную и за первые 8 секунд не понял: вы лечите детей или взрослых, делаете имплантацию или только чистку, в каком городе находитесь. Это первая причина, по которой клиенты закрывают вкладку.",
    },
    {
      id: 2,
      severity: "critical" as const,
      title: "Кнопка не объясняет, что произойдёт",
      description:
        "На главной кнопка «Подробнее» — это самый слабый призыв из возможных. Клиент не понимает: после клика он попадёт в каталог услуг, заполнит форму, или его наберёт менеджер. Когда непонятно — не нажимают.",
    },
    {
      id: 3,
      severity: "critical" as const,
      title: "Нет ни одного отзыва, кейса или фото врачей",
      description:
        "В стоматологии доверие строится на лицах. Если на главной нет фотографий врачей, нет отзывов реальных пациентов и нет фото «до/после» — клиент не понимает, кому доверяет рот. Идёт к конкурентам.",
    },
  ],
  sampleFix: {
    before: "Добро пожаловать в стоматологию «Улыбка»",
    after:
      "Стоматология без боли — приём сегодня, фиксированные цены, без скрытых доплат",
  },
} as const;
