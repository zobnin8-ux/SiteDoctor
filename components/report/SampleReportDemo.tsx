"use client";

import { ReportHeader } from "@/components/report/ReportHeader";
import { ReportIllustration } from "@/components/report/ReportIllustration";
import { ReportHero } from "@/components/report/ReportHero";
import { MonitorScreenshot } from "@/components/report/MonitorScreenshot";
import { OverallScoreBlock } from "@/components/report/OverallScoreBlock";
import { DiagnosisList } from "@/components/report/DiagnosisList";
import { TopIssues } from "@/components/report/TopIssues";
import { SampleFix } from "@/components/report/SampleFix";
import { ReportCTA } from "@/components/report/ReportCTA";
import { ReportFooter } from "@/components/report/ReportFooter";

export function SampleReportDemo() {
  return (
    <div
      className="dark-zone min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]"
      style={{ backgroundImage: "url(/bg/grid-pattern.svg)" }}
    >
      <ReportHeader />
      <ReportIllustration />
      <ReportHero />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[3fr_2fr] md:items-start">
          <MonitorScreenshot />
          <div>
            <OverallScoreBlock />
            <div
              className="my-8 h-px w-full bg-gradient-to-r from-transparent via-[var(--border-glow)] to-transparent"
              aria-hidden
            />
            <DiagnosisList />
          </div>
        </div>
      </section>

      <TopIssues />
      <SampleFix />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <ReportCTA />
      </div>
      <ReportFooter />
    </div>
  );
}
