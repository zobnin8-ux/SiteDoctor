import { createClient } from "@supabase/supabase-js";
import ws from "ws";

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

export const supabase = createClient(url, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
  realtime: {
    // Node < 22 has no global WebSocket; pass `ws` (types differ slightly from DOM WebSocket).
    transport: ws as unknown as import("@supabase/realtime-js").WebSocketLikeConstructor,
    params: {
      eventsPerSecond: 10,
    },
  },
});
