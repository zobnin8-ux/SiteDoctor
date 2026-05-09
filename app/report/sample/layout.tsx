import type { Metadata } from "next";

import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Демо-отчёт — ${BRAND.name}`,
  description:
    "Пример AI-диагноза сайта: оценка, проблемы и рекомендации. Site Doctor.",
  robots: { index: true, follow: true },
};

export default function SampleReportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
