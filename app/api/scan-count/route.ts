import { NextRequest, NextResponse } from "next/server";

import { checkRateLimit } from "@/lib/rate-limit";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const { data, error } = await supabaseAdmin.rpc("increment_scan_count");

    if (error) {
      console.error("RPC error:", error);
      return NextResponse.json({ error: "Failed to increment" }, { status: 500 });
    }

    return NextResponse.json({ scan_count: data });
  } catch (e) {
    console.error("Scan count API error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
