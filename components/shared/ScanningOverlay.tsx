"use client";

export function ScanningOverlay() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl"
      aria-hidden
    >
      <div
        className="scan-beam-animate absolute inset-x-0 h-[28%] opacity-70"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(0,212,255,0.12) 40%, rgba(0,212,255,0.35) 50%, rgba(0,212,255,0.12) 60%, transparent 100%)",
        }}
      />
    </div>
  );
}
