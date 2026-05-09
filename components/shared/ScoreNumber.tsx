"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

import { cn } from "@/lib/utils";

type ScoreNumberProps = {
  /** Анимация от этого значения вниз до `to` */
  from?: number;
  to: number;
  durationMs?: number;
  className?: string;
  glow?: "cyan" | "red" | "none";
};

export function ScoreNumber({
  from = 100,
  to,
  durationMs = 1000,
  className,
  glow = "red",
}: ScoreNumberProps) {
  const [value, setValue] = useState(from);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - (1 - t) * (1 - t);
      const v = Math.round(from + (to - from) * eased);
      setValue(v);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, from, to, durationMs]);

  return (
    <span
      ref={ref}
      className={cn(
        "font-mono-data font-medium tabular-nums",
        glow === "cyan" && "text-glow-cyan",
        glow === "red" && "text-glow-red",
        className
      )}
    >
      {value}
    </span>
  );
}
