"use client";

import Image from "next/image";
import { useState } from "react";

import { ASSETS } from "@/lib/assets";

/**
 * Атмосферный слой: робот на весь кадр, низкая непрозрачность + градиенты для читаемости текста.
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
          className="object-cover object-[center_22%] opacity-[0.13] blur-[1.5px] contrast-[1.05] saturate-[1.05]"
          onError={() => setHidden(true)}
        />
      ) : null}

      <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)] via-[var(--bg-primary)]/70 to-[var(--bg-primary)]" />

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 75% 58% at 50% 30%, transparent 0%, var(--bg-primary) 78%)",
        }}
      />

      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[var(--bg-primary)] to-transparent opacity-95" />
    </div>
  );
}
