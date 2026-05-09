/** Канонические имена файлов из ТЗ (кириллица в URL). */
function asset(path: string): string {
  return encodeURI(path);
}

export const ASSETS = {
  robot: {
    hero: asset("/robot/ChatGPT_Image_9_мая_2026_г___09_37_47.png"),
    scanning: asset("/robot/ChatGPT_Image_9_мая_2026_г___09_22_04.png"),
    report: asset("/robot/ChatGPT_Image_9_мая_2026_г___09_22_12.png"),
  },
  sample: {
    reportBg: asset("/sample/ChatGPT_Image_9_мая_2026_г___09_22_12.png"),
  },
  og: {
    image: asset("/og/ChatGPT_Image_9_мая_2026_г___09_49_25.png"),
  },
} as const;
