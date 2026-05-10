import { createClient } from "@supabase/supabase-js";

/** Клиент только для браузера (Realtime, anon key). */
export function createSupabaseBrowserClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
