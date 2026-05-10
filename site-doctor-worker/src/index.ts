import { processScan } from "./processor.js";
import { buildScanResultFailed } from "./scan-result.js";
import { supabase } from "./supabase.js";
import type { Scan } from "./types.js";

/** Скан завис в analyzing (воркер упал, завис fetch к Storage и т.д.). */
async function recoverStaleAnalyzingScans(maxAgeMinutes = 20) {
  const cutoff = new Date(
    Date.now() - maxAgeMinutes * 60 * 1000
  ).toISOString();

  const { data, error } = await supabase
    .from("scans")
    .select("id, url, normalized_url")
    .eq("status", "analyzing")
    .lt("started_at", cutoff);

  if (error) {
    console.error("recoverStaleAnalyzingScans:", error);
    return;
  }

  if (!data?.length) return;

  console.warn(
    `[recovery] Marking ${data.length} stale analyzing scan(s) as failed (started_at < ${cutoff})`
  );

  const message =
    "Скан завис на этапе AI (таймаут или перезапуск воркера). Запустите проверку снова.";

  for (const row of data) {
    const targetUrl = row.normalized_url?.trim() || row.url;
    const failedPayload = buildScanResultFailed(targetUrl, message);
    const { error: upErr } = await supabase
      .from("scans")
      .update({
        status: "failed",
        progress: 0,
        current_step: null,
        error_message: message,
        completed_at: new Date().toISOString(),
        scan_result: failedPayload,
      })
      .eq("id", row.id);

    if (upErr) {
      console.error(`[recovery] Failed to fix scan ${row.id}:`, upErr);
    } else {
      console.warn(`[recovery] Scan ${row.id} marked failed (was stuck analyzing)`);
    }
  }
}

console.log("🩺 Site Doctor Worker starting...");

// Защита от повторной обработки одного скана
const inFlight = new Set<string>();

async function handleNewScan(scan: Scan) {
  if (inFlight.has(scan.id)) {
    console.log(`[${scan.id}] Already processing, skip`);
    return;
  }

  if (scan.status !== "pending") {
    console.log(`[${scan.id}] Status is ${scan.status}, skip`);
    return;
  }

  inFlight.add(scan.id);

  try {
    await processScan(scan);
  } finally {
    inFlight.delete(scan.id);
  }
}

// При старте: разгребаем накопившиеся pending сканы
async function processBacklog() {
  console.log("Checking for pending scans in backlog...");

  const { data, error } = await supabase
    .from("scans")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true })
    .limit(10);

  if (error) {
    console.error("Failed to fetch backlog:", error);
    return;
  }

  if (!data || data.length === 0) {
    console.log("No pending scans in backlog.");
    return;
  }

  console.log(`Found ${data.length} pending scans, processing sequentially...`);

  for (const scan of data) {
    await handleNewScan(scan as Scan);
  }
}

// Подписка на новые сканы через Realtime
function subscribeToNewScans() {
  console.log("Subscribing to Realtime INSERT events on scans...");

  const channel = supabase
    .channel("scans-worker")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "scans",
      },
      (payload: { new: Record<string, unknown> }) => {
        const scan = payload.new as unknown as Scan;
        console.log(`📥 New scan received: ${scan.id}`);
        handleNewScan(scan).catch((err) => {
          console.error(`[${scan.id}] Unhandled error:`, err);
        });
      }
    )
    .subscribe((status: string) => {
      console.log(`Realtime status: ${status}`);
    });

  return channel;
}

async function main() {
  await recoverStaleAnalyzingScans();
  await processBacklog();
  subscribeToNewScans();
  console.log("✅ Worker is ready and listening.");
}

main().catch((err) => {
  console.error("Fatal error in main:", err);
  process.exit(1);
});

// Грейсфул шатдаун
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down...");
  process.exit(0);
});
