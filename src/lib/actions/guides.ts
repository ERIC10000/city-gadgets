"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type GuideFormResult = { error?: string };

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function readForm(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const maxPrice = String(formData.get("pqMaxPrice") ?? "").trim();
  return {
    title,
    slug: slugify(slugInput || title),
    description: String(formData.get("description") ?? "").trim(),
    excerpt: String(formData.get("excerpt") ?? "").trim(),
    category_slug: String(formData.get("categorySlug") ?? "").trim(),
    hero_image: String(formData.get("heroImage") ?? "").trim() || null,
    picks_heading: String(formData.get("picksHeading") ?? "").trim() || "In stock now",
    body: String(formData.get("body") ?? ""),
    read_minutes: Number(formData.get("readMinutes")) || 4,
    pq_sort: String(formData.get("pqSort") ?? "rating"),
    pq_limit: Number(formData.get("pqLimit")) || 9,
    pq_brand: String(formData.get("pqBrand") ?? "").trim() || null,
    pq_max_price: maxPrice ? Number(maxPrice) : null,
    status: String(formData.get("status") ?? "published"),
    updated_at: new Date().toISOString(),
  };
}

function validate(row: ReturnType<typeof readForm>): string | null {
  if (!row.title) return "Give the guide a title.";
  if (!row.slug) return "The title must contain letters or numbers for the URL.";
  if (!row.category_slug) return "Choose the category this guide funnels into.";
  if (!row.body.trim()) return "Write the guide body.";
  return null;
}

function revalidateGuides(slug?: string) {
  revalidatePath("/vendor/guides");
  revalidatePath("/guides");
  revalidatePath("/");
  if (slug) revalidatePath(`/guides/${slug}`);
}

export async function createGuide(formData: FormData): Promise<GuideFormResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  const row = readForm(formData);
  const err = validate(row);
  if (err) return { error: err };

  const { error } = await supabase.from("product_guides").insert({ ...row, vendor_id: user.id });
  if (error) return { error: error.message.includes("duplicate") ? "That URL slug is already taken — tweak the title or slug." : error.message };

  revalidateGuides(row.slug);
  redirect("/vendor/guides");
}

export async function updateGuide(id: string, formData: FormData): Promise<GuideFormResult> {
  const supabase = await createClient();
  const row = readForm(formData);
  const err = validate(row);
  if (err) return { error: err };

  const { error } = await supabase.from("product_guides").update(row).eq("id", id);
  if (error) return { error: error.message.includes("duplicate") ? "That URL slug is already taken — tweak the slug." : error.message };

  revalidateGuides(row.slug);
  redirect("/vendor/guides");
}

export async function deleteGuide(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const supabase = await createClient();
  await supabase.from("product_guides").delete().eq("id", id);
  revalidateGuides();
}
