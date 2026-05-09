"use client";

import Image from "next/image";

import { ScanningOverlay } from "@/components/shared/ScanningOverlay";
import { SAMPLE_REPORT } from "@/lib/sample-report";

export function MonitorScreenshot() {
  return (
    <div className="relative">
      <span
        className="pointer-events-none absolute -left-1 -top-1 z-[2] h-4 w-4 border-l-2 border-t-2 border-[var(--accent-primary)]"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute -right-1 -top-1 z-[2] h-4 w-4 border-r-2 border-t-2 border-[var(--accent-primary)]"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute -bottom-1 -left-1 z-[2] h-4 w-4 border-b-2 border-l-2 border-[var(--accent-primary)]"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute -bottom-1 -right-1 z-[2] h-4 w-4 border-b-2 border-r-2 border-[var(--accent-primary)]"
        aria-hidden
      />
      <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)]">
        <Image
          src="/sample/screenshot-blurred.jpg"
          alt=""
          fill
          className="object-cover brightness-[0.5]"
          sizes="(max-width: 768px) 100vw, 60vw"
          priority
        />
        <ScanningOverlay />
        <div className="absolute inset-0 backdrop-blur-[1px]" aria-hidden />
      </div>
      <p className="mt-3 font-mono-data text-xs text-[var(--text-muted)]">
        PATIENT: {SAMPLE_REPORT.patient}
      </p>
    </div>
  );
}
