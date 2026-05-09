/**
 * Статические PNG. Имена как в ТЗ; `encodeURI` стабилизирует кириллицу в URL для `next/image`.
 */
function assetUrl(path: string): string {
  return encodeURI(path);
}

export const ASSETS = {
  robot: {
    hero: assetUrl(
      "/robot/ChatGPT_Image_9_мая_2026_г___09_37_47.png"
    ),
    scanning: assetUrl(
      "/robot/ChatGPT_Image_9_мая_2026_г___09_22_04.png"
    ),
    report: assetUrl(
      "/robot/ChatGPT_Image_9_мая_2026_г___09_22_12.png"
    ),
  },
  sample: {
    reportBg: assetUrl(
      "/sample/ChatGPT_Image_9_мая_2026_г___09_22_12.png"
    ),
  },
  og: {
    image: assetUrl(
      "/og/ChatGPT_Image_9_мая_2026_г___09_49_25.png"
    ),
  },
} as const;
