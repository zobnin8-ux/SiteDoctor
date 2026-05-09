/** Статичный демо-контент для /report/sample — landing-spec-v2-addendum §6 */

export const SAMPLE_PATIENT_HOST = "example-stomatology.ru";

export const SAMPLE_DIAGNOSIS = [
  { id: "cvp", label: "Clear Value Proposition", level: "critical" as const },
  { id: "cta", label: "Strong CTA", level: "critical" as const },
  { id: "mob", label: "Mobile Optimization", level: "warning" as const },
  { id: "speed", label: "Page Speed", level: "warning" as const },
  { id: "trust", label: "Trust Signals", level: "critical" as const },
  { id: "seo", label: "SEO Structure", level: "ok" as const },
];

export const SAMPLE_TOP_ISSUES = [
  {
    title: "Непонятно, чем вы занимаетесь",
    body: "Зашёл на главную и за первые 8 секунд не понял: вы лечите детей или взрослых, делаете имплантацию или только чистку, в Москве вы или в Подмосковье. Это первая причина, по которой клиенты закрывают вкладку.",
    severity: "Критично" as const,
  },
  {
    title: "Кнопка не объясняет, что произойдёт",
    body: 'На главной кнопка «Подробнее» — это самый слабый призыв из возможных. Клиент не понимает: после клика он попадёт в каталог услуг, заполнит форму, или его наберёт менеджер. Когда непонятно — не нажимают.',
    severity: "Критично" as const,
  },
  {
    title: "Нет ни одного отзыва, кейса или фото врачей",
    body: 'В стоматологии доверие строится на лицах. Если на главной нет фотографий врачей, нет отзывов реальных пациентов и нет фото «до/после» — клиент не понимает, кому доверяет рот. Идёт к конкурентам.',
    severity: "Критично" as const,
  },
];

export const SAMPLE_FIX = {
  before: 'Добро пожаловать в стоматологию «Улыбка»',
  after:
    "Стоматология без боли в Москве — приём сегодня, фиксированные цены, рассрочка 0%",
};

export const SAMPLE_SCORE = 42;

export const SAMPLE_REPORT_DATE = "09.05.2026";
