import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

export async function getCurrentUser(): Promise<{ email: string; profile: Profile } | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();

  return {
    email: user.email ?? "",
    profile: (profile as Profile) ?? {
      id: user.id,
      full_name: null,
      avatar_url: null,
      phone: null,
      role: "customer",
      loyalty_points: 0,
      store_credit: 0,
    },
  };
}
