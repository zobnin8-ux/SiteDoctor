"use client";

/**
 * Центральный фокус сканирования: расходящиеся круги + вращающееся кольцо (без прямоугольного PNG).
 */
export function ScanningFocal() {
  return (
    <div
      className="relative mb-2 flex h-[220px] w-full max-w-[280px] items-center justify-center sm:h-[240px] sm:max-w-[320px]"
      aria-hidden
    >
      <div className="scan-focal-ripples absolute inset-0">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="scan-focal-ripple absolute rounded-full border border-[var(--accent-primary)]"
            style={{ animationDelay: `${i * 0.55}s` }}
          />
        ))}
      </div>

      <div className="pointer-events-none absolute flex h-32 w-32 items-center justify-center">
        <div className="scanning-ring relative z-[1] h-[7.25rem] w-[7.25rem]" />
      </div>

      <div className="scan-focal-core relative z-[2] rounded-full bg-[var(--accent-primary)]" />
    </div>
  );
}
