import { Suspense } from "react";

import { ScanningClient } from "./ScanningClient";

export default function ScanningPage() {
  return (
    <Suspense
      fallback={
        <div className="dark-zone flex min-h-screen items-center justify-center bg-[var(--bg-primary)] text-[var(--text-primary)]">
          <p className="font-mono-data text-sm text-[var(--text-muted)]">
            Загрузка…
          </p>
        </div>
      }
    >
      <ScanningClient />
    </Suspense>
  );
}
