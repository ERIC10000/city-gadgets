import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/env";

let cached: SupabaseClient | null = null;

/**
 * Cookie-free Supabase client for PUBLIC data reads (products, categories,
 * videos, published reviews).
 *
 * The regular server client reads `cookies()` to carry the user session, which
 * opts every page that touches it into per-request dynamic rendering. Public
 * catalogue data doesn't need a session, so reading it through this client lets
 * those pages be statically generated / ISR-cached — turning a ~2s server
 * render into an edge-cache hit. Never use this for authenticated or
 * user-specific reads.
 */
export function createPublicClient(): SupabaseClient {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Supabase is not configured — set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }
  if (!cached) {
    cached = createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cached;
}
