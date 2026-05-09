import { supabase } from "@/lib/supabase/client";

const FALLBACK_COUNT = 14;

export async function getScanCount(): Promise<number> {
  try {
    const { data, error } = await supabase
      .from("stats")
      .select("scan_count")
      .eq("id", 1)
      .single();

    if (error || !data) {
      console.warn("Failed to fetch scan count:", error);
      return FALLBACK_COUNT;
    }

    return Number(data.scan_count);
  } catch (e) {
    console.warn("Stats fetch exception:", e);
    return FALLBACK_COUNT;
  }
}
