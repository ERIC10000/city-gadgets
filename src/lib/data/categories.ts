import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/lib/types";
import rawCategories from "@/data/seed/categories.generated.json";

type SeedCategory = { slug: string; name: string; icon: string; heroTagline: string; heroImage: string };

function fromSeed(): Category[] {
  return (rawCategories as SeedCategory[]).map((c, i) => ({
    id: c.slug,
    slug: c.slug,
    name: c.name,
    icon: c.icon,
    hero_tagline: c.heroTagline,
    hero_image: c.heroImage,
    sort_order: i,
  }));
}

export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured()) return fromSeed();

  const supabase = await createClient();
  const { data, error } = await supabase.from("categories").select("*").order("sort_order");
  if (error || !data) return fromSeed();
  return data as Category[];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getCategories();
  return categories.find((c) => c.slug === slug) ?? null;
}
