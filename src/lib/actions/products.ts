"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseSpecs(formData: FormData): Record<string, string> {
  const keys = formData.getAll("specKey") as string[];
  const values = formData.getAll("specValue") as string[];
  const specs: Record<string, string> = {};
  keys.forEach((key, i) => {
    if (key.trim()) specs[key.trim()] = (values[i] ?? "").trim();
  });
  return specs;
}

export type ProductFormResult = { error?: string };

export async function createProduct(formData: FormData): Promise<ProductFormResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  const name = String(formData.get("name") ?? "");
  const slug = slugify(String(formData.get("slug") || name));
  const imageUrls = String(formData.get("imageUrls") ?? "")
    .split("\n")
    .map((u) => u.trim())
    .filter(Boolean);

  const { data: product, error } = await supabase
    .from("products")
    .insert({
      vendor_id: user.id,
      category_id: String(formData.get("categoryId") ?? "") || null,
      slug,
      name,
      brand: String(formData.get("brand") ?? ""),
      description: String(formData.get("description") ?? ""),
      price: Number(formData.get("price") ?? 0),
      compare_at_price: formData.get("compareAtPrice") ? Number(formData.get("compareAtPrice")) : null,
      condition: String(formData.get("condition") ?? "new"),
      stock_quantity: Number(formData.get("stockQuantity") ?? 0),
      specs: parseSpecs(formData),
      status: String(formData.get("status") ?? "draft"),
    })
    .select("id")
    .single();

  if (error || !product) return { error: error?.message ?? "Could not create product" };

  if (imageUrls.length) {
    await supabase.from("product_images").insert(
      imageUrls.map((url, i) => ({ product_id: product.id, url, alt_text: name, sort_order: i })),
    );
  }

  revalidatePath("/vendor/products");
  revalidatePath("/", "layout"); // storefront: home, shop, categories, deals, product pages
  redirect("/vendor/products");
}

export async function updateProduct(id: string, formData: FormData): Promise<ProductFormResult> {
  const supabase = await createClient();
  const name = String(formData.get("name") ?? "");
  const slug = slugify(String(formData.get("slug") || name));
  const imageUrls = String(formData.get("imageUrls") ?? "")
    .split("\n")
    .map((u) => u.trim())
    .filter(Boolean);

  const { error } = await supabase
    .from("products")
    .update({
      category_id: String(formData.get("categoryId") ?? "") || null,
      slug,
      name,
      brand: String(formData.get("brand") ?? ""),
      description: String(formData.get("description") ?? ""),
      price: Number(formData.get("price") ?? 0),
      compare_at_price: formData.get("compareAtPrice") ? Number(formData.get("compareAtPrice")) : null,
      condition: String(formData.get("condition") ?? "new"),
      stock_quantity: Number(formData.get("stockQuantity") ?? 0),
      specs: parseSpecs(formData),
      status: String(formData.get("status") ?? "draft"),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { error: error.message };

  if (imageUrls.length) {
    await supabase.from("product_images").delete().eq("product_id", id);
    await supabase.from("product_images").insert(
      imageUrls.map((url, i) => ({ product_id: id, url, alt_text: name, sort_order: i })),
    );
  }

  revalidatePath("/vendor/products");
  revalidatePath("/", "layout"); // storefront: home, shop, categories, deals, product pages
  redirect("/vendor/products");
}

export async function deleteProduct(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const supabase = await createClient();
  await supabase.from("products").delete().eq("id", id);
  revalidatePath("/vendor/products");
  revalidatePath("/", "layout"); // storefront: home, shop, categories, deals, product pages
}

export async function toggleProductStatus(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "draft");
  const supabase = await createClient();
  await supabase
    .from("products")
    .update({ status: status === "published" ? "draft" : "published" })
    .eq("id", id);
  revalidatePath("/vendor/products");
  revalidatePath("/", "layout"); // storefront: home, shop, categories, deals, product pages
}
