import { Suspense } from "react";

import { ScanningByIdClient } from "@/components/scanning/ScanningByIdClient";

export default function ScanningByIdPage() {
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
      <ScanningByIdClient />
    </Suspense>
  );
}
