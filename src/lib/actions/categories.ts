"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createCategory(formData: FormData) {
  const name = String(formData.get("name") ?? "");
  const icon = String(formData.get("icon") ?? "devices");
  const hero_tagline = String(formData.get("hero_tagline") ?? "") || null;
  const hero_image = String(formData.get("hero_image") ?? "") || null;
  const slug = slugify(name);
  const supabase = await createClient();
  await supabase.from("categories").insert({ slug, name, icon, hero_tagline, hero_image, sort_order: 9999 });
  revalidatePath("/vendor/categories");
}

export async function updateCategory(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "");
  const icon = String(formData.get("icon") ?? "devices");
  const hero_tagline = String(formData.get("hero_tagline") ?? "") || null;
  const hero_image = String(formData.get("hero_image") ?? "") || null;
  const supabase = await createClient();
  await supabase.from("categories").update({ name, icon, hero_tagline, hero_image }).eq("id", id);
  revalidatePath("/vendor/categories");
}

export async function deleteCategory(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const supabase = await createClient();
  await supabase.from("categories").delete().eq("id", id);
  revalidatePath("/vendor/categories");
}
