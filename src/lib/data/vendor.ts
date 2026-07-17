import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import type { Product, ProductVideo } from "@/lib/types";

export async function getVendorProducts(vendorId: string): Promise<Product[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, product_images(url, alt_text, sort_order), categories(slug)")
    .eq("vendor_id", vendorId)
    .order("created_at", { ascending: false });
  if (error || !data) return [];

  return data.map((row) => ({
    ...(row as unknown as Product),
    category_slug: (row as { categories: { slug: string } | null }).categories?.slug ?? "",
    images: ((row as { product_images: { url: string; alt_text: string; sort_order: number }[] }).product_images ?? [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((img) => ({ url: img.url, alt: img.alt_text })),
  }));
}

export async function getVendorProduct(vendorId: string, id: string): Promise<Product | null> {
  const products = await getVendorProducts(vendorId);
  return products.find((p) => p.id === id) ?? null;
}

export async function getVendorVideos(vendorId: string): Promise<ProductVideo[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("product_videos")
    .select("*")
    .eq("vendor_id", vendorId)
    .order("created_at", { ascending: false });
  return (data as ProductVideo[]) ?? [];
}

export function vendorStats(products: Product[]) {
  const published = products.filter((p) => p.status === "published").length;
  const outOfStock = products.filter((p) => p.stock_quantity <= 0).length;
  const inventoryValue = products.reduce((sum, p) => sum + p.price * p.stock_quantity, 0);
  return { total: products.length, published, outOfStock, inventoryValue };
}
