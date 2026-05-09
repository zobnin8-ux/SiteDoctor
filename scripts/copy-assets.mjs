/**
 * Приводит ассеты к каноническим именам из ТЗ в public/.
 *
 * Ищет исходник: сначала по метке времени в `assets/` и `public/**`,
 * затем запасные имена (`hero-robot.png` и т.д.). Для OG: если нет
 * `09_49_25`, подставляет `09_26_46` под целевым именем 09_49_25.
 *
 * Запуск из корня репозитория:
 *   npm run copy-assets
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function listDir(abs) {
  try {
    return fs.readdirSync(abs);
  } catch {
    return [];
  }
}

function isImage(name) {
  return /\.(png|jpg|jpeg)$/i.test(name);
}

function findHintInDir(absDir, hint) {
  for (const f of listDir(absDir)) {
    if (f.includes(hint) && isImage(f)) return path.join(absDir, f);
  }
  return null;
}

function findFirstHint(hint, relDirs) {
  for (const rel of relDirs) {
    const hit = findHintInDir(path.join(root, rel), hint);
    if (hit) return hit;
  }
  return null;
}

function findFallback(filenames) {
  const robot = path.join(root, "public", "robot");
  for (const n of filenames) {
    const p = path.join(robot, n);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

/** @type {Array<{ dest: string, hints: string[], dirs: string[], fallbacks?: string[], altHints?: string[], altDirs?: string[] }>} */
const targets = [
  {
    dest: "public/robot/ChatGPT_Image_9_мая_2026_г___09_37_47.png",
    hints: ["09_37_47"],
    dirs: ["assets", "public/robot"],
    fallbacks: ["hero-robot.png", "hero-robot@2x.png"],
  },
  {
    dest: "public/robot/ChatGPT_Image_9_мая_2026_г___09_22_04.png",
    hints: ["09_22_04"],
    dirs: ["assets", "public/robot"],
    fallbacks: ["scanning-robot.png", "scanning-robot@2x.png"],
  },
  {
    dest: "public/robot/ChatGPT_Image_9_мая_2026_г___09_22_12.png",
    hints: ["09_22_12"],
    dirs: ["assets", "public/robot", "public/sample"],
    fallbacks: ["report-robot.png"],
  },
  {
    dest: "public/sample/ChatGPT_Image_9_мая_2026_г___09_22_12.png",
    hints: ["09_22_12"],
    dirs: ["assets", "public/sample", "public/robot"],
    fallbacks: [],
  },
  {
    dest: "public/og/ChatGPT_Image_9_мая_2026_г___09_49_25.png",
    hints: ["09_49_25"],
    dirs: ["assets", "public/og"],
    altHints: ["09_26_46"],
    altDirs: ["assets", "public/og"],
    fallbacks: [],
  },
];

function resolveSource(t) {
  for (const h of t.hints) {
    const hit = findFirstHint(h, t.dirs);
    if (hit) return hit;
  }

  if (t.altHints?.length) {
    const dirs = t.altDirs || t.dirs;
    for (const h of t.altHints) {
      const hit = findFirstHint(h, dirs);
      if (hit) return hit;
    }
  }

  if (t.fallbacks?.length) {
    const fb = findFallback(t.fallbacks);
    if (fb) return fb;
  }

  throw new Error(
    `Не найден исходный файл для «${t.dest}». Положите PNG в assets/ или public/, затем снова npm run copy-assets`
  );
}

for (const t of targets) {
  const destAbs = path.join(root, t.dest);
  let srcAbs;
  try {
    srcAbs = resolveSource(t);
  } catch (e) {
    console.warn(String(e.message));
    continue;
  }

  if (path.resolve(srcAbs) === path.resolve(destAbs)) {
    console.log("OK (уже на месте)", t.dest);
    continue;
  }

  fs.mkdirSync(path.dirname(destAbs), { recursive: true });
  fs.copyFileSync(srcAbs, destAbs);
  console.log("OK", t.dest, "←", path.relative(root, srcAbs));
}
