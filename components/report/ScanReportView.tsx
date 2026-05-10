"use client";

import type { ReportViewModel } from "@/lib/scan-report";

import { AiUnavailableBanner } from "@/components/report/AiUnavailableBanner";
import { ReportHeader } from "@/components/report/ReportHeader";
import { ReportHero } from "@/components/report/ReportHero";
import { MonitorScreenshot } from "@/components/report/MonitorScreenshot";
import { OverallScoreBlock } from "@/components/report/OverallScoreBlock";
import { DiagnosisList } from "@/components/report/DiagnosisList";
import { TopIssues } from "@/components/report/TopIssues";
import { SampleFix } from "@/components/report/SampleFix";
import { ReportFinalCta } from "@/components/report/ReportFinalCta";
import { ReportFooter } from "@/components/report/ReportFooter";
import { ReportSaveBlock } from "@/components/report/ReportSaveBlock";

type ScanReportViewProps = {
  model: ReportViewModel;
  scanId: string;
  scanUrl: string;
};

export function ScanReportView({ model, scanId, scanUrl }: ScanReportViewProps) {
  const subScoresAi =
    model.reportKind === "ai" && model.subScores
      ? {
          trust: model.subScores.trust,
          cta: model.subScores.cta,
          clarity: model.subScores.clarity,
          mobile: model.subScores.mobile,
          visual: model.subScores.visual,
        }
      : undefined;

  return (
    <div
      className="dark-zone min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]"
      style={{ backgroundImage: "url(/bg/grid-pattern.svg)" }}
    >
      <ReportHeader />
      {model.aiUnavailableBanner ? <AiUnavailableBanner /> : null}
      <ReportHero
        patient={model.hostname}
        date={model.completedLabel}
        industryLabel={model.industryLabel}
        aiSummary={model.aiSummary}
      />

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
              subScores={subScoresAi}
            />
            <div
              className="my-8 h-px w-full bg-gradient-to-r from-transparent via-[var(--border-glow)] to-transparent"
              aria-hidden
            />
            {model.reportKind === "heuristic" ? (
              <DiagnosisList rows={model.diagnosis} />
            ) : null}
          </div>
        </div>
      </section>

      {model.topIssues.length > 0 ? (
        <TopIssues issues={model.topIssues} />
      ) : null}

      <SampleFix before={model.sampleFix.before} after={model.sampleFix.after} />

      <ReportSaveBlock scanId={scanId} scanUrl={scanUrl} />

      <ReportFinalCta />
      <ReportFooter />
    </div>
  );
}
