"use client";

import type { ReportViewModel } from "@/lib/scan-report";

import { ReportHeader } from "@/components/report/ReportHeader";
import { ReportHero } from "@/components/report/ReportHero";
import { MonitorScreenshot } from "@/components/report/MonitorScreenshot";
import { OverallScoreBlock } from "@/components/report/OverallScoreBlock";
import { DiagnosisList } from "@/components/report/DiagnosisList";
import { TopIssues } from "@/components/report/TopIssues";
import { SampleFix } from "@/components/report/SampleFix";
import { ReportCTA } from "@/components/report/ReportCTA";
import { ReportFooter } from "@/components/report/ReportFooter";

type ScanReportViewProps = {
  model: ReportViewModel;
};

export function ScanReportView({ model }: ScanReportViewProps) {
  return (
    <div
      className="dark-zone min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]"
      style={{ backgroundImage: "url(/bg/grid-pattern.svg)" }}
    >
      <ReportHeader />
      <ReportHero patient={model.hostname} date={model.completedLabel} />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[3fr_2fr] md:items-start">
          <MonitorScreenshot
            patient={model.hostname}
            desktopUrl={model.desktopShot}
            mobileUrl={model.mobileShot}
          />
          <div>
            <OverallScoreBlock
              score={model.score}
              scoreVerdict={model.scoreVerdict}
            />
            <div
              className="my-8 h-px w-full bg-gradient-to-r from-transparent via-[var(--border-glow)] to-transparent"
              aria-hidden
            />
            <DiagnosisList rows={model.diagnosis} />
          </div>
        </div>
      </section>

      {model.topIssues.length > 0 ? (
        <TopIssues issues={model.topIssues} />
      ) : null}

      <SampleFix before={model.sampleFix.before} after={model.sampleFix.after} />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <ReportCTA />
      </div>
      <ReportFooter />
    </div>
  );
}
