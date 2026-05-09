"use client";

import Image from "next/image";
import { useState } from "react";

import { ASSETS } from "@/lib/assets";

/**
 * Робот на весь блок сканирования: виден сквозь лёгкие градиенты (без сплошной заливки поверх PNG).
 */
export function ScanningBackdrop() {
  const [hidden, setHidden] = useState(false);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      {!hidden ? (
        <Image
          src={ASSETS.robot.scanning}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_28%] opacity-[0.42] saturate-[1.08]"
          onError={(e) => {
            console.warn(
              "Scanning backdrop image failed:",
              ASSETS.robot.scanning,
              e
            );
            setHidden(true);
          }}
        />
      ) : null}

      {/* Виньетка по краям — центр остаётся открытым, робот читается */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 95% 90% at 50% 36%, transparent 18%, rgba(10, 14, 26, 0.65) 62%, var(--bg-primary) 98%)",
        }}
      />

      {/* Низ: под список шагов и прогресс */}
      <div className="absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/88 to-transparent" />

      {/* Верх: лёгкая подложка под центральный радар (чуть контраста) */}
      <div className="absolute inset-x-0 top-0 h-[28%] bg-gradient-to-b from-[var(--bg-primary)]/55 to-transparent" />
    </div>
  );
}
