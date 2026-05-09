/**
 * Статические PNG. Имена как в ТЗ; `encodeURI` — решение A (v1.1) для стабильной
 * подгрузки кириллицы в `next/image`. Если не помогает — переименовать в
 * `public/` на латиницу и обновить пути ниже.
 */
function assetUrl(path: string): string {
  return encodeURI(path);
}

export const ASSETS = {
  robot: {
    /** Hero: робот со стетоскопом, фон прозрачный; файл должен совпадать с содержимым, не только с именем. */
    hero: assetUrl(
      "/robot/ChatGPT_Image_9_мая_2026_г___09_36_21.png"
    ),
    scanning: assetUrl(
      "/robot/ChatGPT_Image_9_мая_2026_г___09_28_40.png"
    ),
    report: assetUrl(
      "/robot/ChatGPT_Image_9_мая_2026_г___09_22_04.png"
    ),
  },
  sample: {
    reportBg: assetUrl(
      "/sample/ChatGPT_Image_9_мая_2026_г___09_22_12.png"
    ),
  },
  og: {
    image: assetUrl(
      "/og/ChatGPT_Image_9_мая_2026_г___09_26_46.png"
    ),
  },
} as const;
