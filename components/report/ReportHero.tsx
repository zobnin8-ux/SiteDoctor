"use client";

import Image from "next/image";
import { useState } from "react";

import { RobotPlaceholder } from "@/components/shared/RobotPlaceholder";
import { ASSETS } from "@/lib/assets";
import { SAMPLE_REPORT } from "@/lib/sample-report";

type ReportHeroProps = {
  patient?: string;
  date?: string;
};

export function ReportHero({
  patient = SAMPLE_REPORT.patient,
  date = SAMPLE_REPORT.date,
}: ReportHeroProps) {
  const [err, setErr] = useState(false);

  return (
    <section className="border-b border-[var(--border)] bg-[var(--bg-secondary)]/40 py-8 md:py-10">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-[200px_1fr] lg:px-8">
        <div className="hidden justify-center md:flex">
          {err ? (
            <RobotPlaceholder size={200} variant="report" />
          ) : (
            <Image
              src={ASSETS.robot.report}
              alt=""
              width={200}
              height={200}
              className="report-robot-glow object-contain"
              onError={(e) => {
                console.warn(
                  "Report robot image failed to load:",
                  ASSETS.robot.report,
                  e
                );
                setErr(true);
              }}
            />
          )}
        </div>
        <div className="text-center md:text-left">
          <p className="font-mono-data text-xs uppercase tracking-widest text-[var(--accent-primary)]">
            PATIENT · DIAGNOSTIC REPORT
          </p>
          <p className="mt-2 font-display text-xl font-semibold text-[var(--text-primary)] sm:text-2xl">
            {patient}
          </p>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Диагностика завершена · {date}
          </p>
          <p className="mt-4 text-sm italic text-[var(--text-secondary)]">
            Dr. Site Doctor
          </p>
        </div>
      </div>
    </section>
  );
}
