"use client";

import Image from "next/image";
import { useState } from "react";

import { RobotPlaceholder } from "@/components/shared/RobotPlaceholder";
import { SAMPLE_REPORT } from "@/lib/sample-report";

const HERO_LAB_IMAGE = "/report/hero-ai-lab.png";

type ReportHeroProps = {
  patient?: string;
  date?: string;
  /** Подпись индустрии (AI). */
  industryLabel?: string;
  /** Краткий разбор от AI («доктор»). */
  aiSummary?: string;
};

export function ReportHero({
  patient = SAMPLE_REPORT.patient,
  date = SAMPLE_REPORT.date,
  industryLabel,
  aiSummary,
}: ReportHeroProps) {
  const [labErr, setLabErr] = useState(false);

  return (
    <section className="border-b border-[var(--border)] bg-[var(--bg-secondary)]/40 py-8 md:py-10">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(260px,300px)_1fr] lg:px-8">
        <div className="hidden justify-center md:flex md:justify-start">
          {labErr ? (
            <RobotPlaceholder size={240} variant="report" />
          ) : (
            <div className="relative h-[168px] w-[270px] shrink-0 sm:h-[184px] sm:w-[295px]">
              <Image
                src={HERO_LAB_IMAGE}
                alt="Site Doctor AI — диагностика и оптимизация сайта"
                fill
                className="object-contain object-left"
                sizes="(max-width: 640px) 0px, 295px"
                priority
                onError={() => setLabErr(true)}
              />
            </div>
          )}
        </div>
        <div className="text-center md:text-left">
          <p className="font-mono-data text-xs uppercase tracking-widest text-[var(--accent-primary)]">
            PATIENT · DIAGNOSTIC REPORT
          </p>
          {industryLabel ? (
            <p className="mt-2 font-mono-data text-[10px] uppercase tracking-wide text-[var(--text-muted)]">
              {industryLabel}
            </p>
          ) : null}
          <p className="mt-2 font-display text-xl font-semibold text-[var(--text-primary)] sm:text-2xl">
            {patient}
          </p>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Диагностика завершена · {date}
          </p>
          {aiSummary ? (
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)]">
              {aiSummary}
            </p>
          ) : null}
          <p className="mt-4 text-sm italic text-[var(--text-secondary)]">
            Dr. Site Doctor
          </p>
        </div>
      </div>
    </section>
  );
}
