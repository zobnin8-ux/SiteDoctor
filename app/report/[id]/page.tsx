import { notFound } from "next/navigation";

import {
  ReportFailedState,
  ReportIncompleteState,
  ReportPendingState,
} from "@/components/report/ReportPageStates";
import { ScanReportView } from "@/components/report/ScanReportView";
import { buildReportViewModel } from "@/lib/scan-report";
import { supabaseAdmin } from "@/lib/supabase/server";

type ReportPageProps = {
  params: { id: string };
};

export default async function ReportByScanIdPage({ params }: ReportPageProps) {
  const { id } = params;

  const { data, error } = await supabaseAdmin
    .from("scans")
    .select(
      "id, url, status, completed_at, error_message, current_step, desktop_screenshot_url, mobile_screenshot_url, scan_result"
    )
    .eq("id", id)
    .single();

  if (error || !data) {
    notFound();
  }

  if (data.status === "failed") {
    return <ReportFailedState message={data.error_message} />;
  }

  if (data.status !== "ready") {
    return (
      <ReportPendingState
        scanId={id}
        status={data.status}
        step={data.current_step}
      />
    );
  }

  const model = buildReportViewModel(data);
  if (!model) {
    return <ReportIncompleteState />;
  }

  return (
    <ScanReportView model={model} scanId={id} scanUrl={data.url} />
  );
}
