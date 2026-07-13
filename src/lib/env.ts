export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * True once a real Supabase project is wired up. Until then, the data layer
 * (see src/lib/data/*) transparently serves the bundled seed catalog so the
 * storefront is fully browsable with zero backend setup.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}
