/**
 * Копирует PNG из assets/ в public/ с именами из ТЗ (кириллица в имени файла).
 * Запуск: node scripts/copy-assets.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const assetsDir = path.join(root, "assets");

const targets = [
  { globHint: "09_36_21", dest: "public/robot/ChatGPT_Image_9_мая_2026_г___09_36_21.png" },
  { globHint: "09_28_40", dest: "public/robot/ChatGPT_Image_9_мая_2026_г___09_28_40.png" },
  { globHint: "09_22_04", dest: "public/robot/ChatGPT_Image_9_мая_2026_г___09_22_04.png" },
  { globHint: "09_22_12", dest: "public/sample/ChatGPT_Image_9_мая_2026_г___09_22_12.png" },
  { globHint: "09_26_46", dest: "public/og/ChatGPT_Image_9_мая_2026_г___09_26_46.png" },
];

function findSource(hint) {
  const files = fs.readdirSync(assetsDir);
  const m = files.find((f) => f.includes(hint));
  if (!m) throw new Error(`Не найден файл с «${hint}» в assets/`);
  return path.join(assetsDir, m);
}

for (const t of targets) {
  const src = findSource(t.globHint);
  const dest = path.join(root, t.dest);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  console.log("OK", t.dest, "←", path.basename(src));
}
