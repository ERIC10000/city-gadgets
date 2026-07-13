import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/types";
import rawProducts from "@/data/seed/products.generated.json";

type SeedProduct = Omit<Product, "id" | "vendor_id" | "currency" | "status" | "category_slug"> & {
  category_slug: string;
};

const SEED_PRODUCTS: Product[] = (rawProducts as unknown as SeedProduct[]).map((p) => ({
  ...p,
  id: p.slug,
  vendor_id: null,
  currency: "KES",
  status: "published",
}));

export type ProductSort = "featured" | "price-asc" | "price-desc" | "newest" | "rating";

export type ProductQuery = {
  categorySlug?: string;
  search?: string;
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  sort?: ProductSort;
  limit?: number;
  offset?: number;
  featuredOnly?: boolean;
};

export type ProductPage = { items: Product[]; total: number };

function sortSeed(items: Product[], sort: ProductSort | undefined): Product[] {
  const sorted = [...items];
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "newest":
      return sorted.reverse();
    case "featured":
    default:
      return sorted.sort((a, b) => Number(b.is_featured) - Number(a.is_featured));
  }
}

function queryFromSeed(query: ProductQuery): ProductPage {
  let items = SEED_PRODUCTS.filter((p) => p.status === "published");

  if (query.categorySlug) items = items.filter((p) => p.category_slug === query.categorySlug);
  if (query.featuredOnly) items = items.filter((p) => p.is_featured);
  if (query.brands?.length) items = items.filter((p) => p.brand && query.brands!.includes(p.brand));
  if (query.minPrice != null) items = items.filter((p) => p.price >= query.minPrice!);
  if (query.maxPrice != null) items = items.filter((p) => p.price <= query.maxPrice!);
  if (query.search) {
    const q = query.search.toLowerCase();
    items = items.filter((p) => p.name.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q));
  }

  items = sortSeed(items, query.sort);
  const total = items.length;
  const offset = query.offset ?? 0;
  const limit = query.limit ?? total;
  return { items: items.slice(offset, offset + limit), total };
}

export async function getProducts(query: ProductQuery = {}): Promise<ProductPage> {
  if (!isSupabaseConfigured()) return queryFromSeed(query);

  const supabase = await createClient();
  let request = supabase
    .from("products")
    .select("*, product_images(url, alt_text, sort_order), categories!inner(slug)", { count: "exact" })
    .eq("status", "published");

  if (query.categorySlug) request = request.eq("categories.slug", query.categorySlug);
  if (query.featuredOnly) request = request.eq("is_featured", true);
  if (query.brands?.length) request = request.in("brand", query.brands);
  if (query.minPrice != null) request = request.gte("price", query.minPrice);
  if (query.maxPrice != null) request = request.lte("price", query.maxPrice);
  if (query.search) request = request.ilike("name", `%${query.search}%`);

  switch (query.sort) {
    case "price-asc":
      request = request.order("price", { ascending: true });
      break;
    case "price-desc":
      request = request.order("price", { ascending: false });
      break;
    case "rating":
      request = request.order("rating", { ascending: false });
      break;
    case "newest":
      request = request.order("created_at", { ascending: false });
      break;
    default:
      request = request.order("is_featured", { ascending: false }).order("created_at", { ascending: false });
  }

  const offset = query.offset ?? 0;
  const limit = query.limit ?? 24;
  request = request.range(offset, offset + limit - 1);

  const { data, error, count } = await request;
  if (error || !data) return queryFromSeed(query);

  const items: Product[] = data.map((row) => ({
    ...(row as unknown as Product),
    category_slug: (row as { categories: { slug: string } }).categories.slug,
    images: ((row as { product_images: { url: string; alt_text: string; sort_order: number }[] }).product_images ?? [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((img) => ({ url: img.url, alt: img.alt_text })),
  }));

  return { items, total: count ?? items.length };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isSupabaseConfigured()) return SEED_PRODUCTS.find((p) => p.slug === slug) ?? null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, product_images(url, alt_text, sort_order), categories!inner(slug)")
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) return null;

  return {
    ...(data as unknown as Product),
    category_slug: (data as { categories: { slug: string } }).categories.slug,
    images: ((data as { product_images: { url: string; alt_text: string; sort_order: number }[] }).product_images ?? [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((img) => ({ url: img.url, alt: img.alt_text })),
  };
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const { items } = await getProducts({ categorySlug: product.category_slug, limit: limit + 1 });
  return items.filter((p) => p.id !== product.id).slice(0, limit);
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  const { items } = await getProducts({ featuredOnly: true, limit });
  return items;
}

export function getAllBrands(): string[] {
  return Array.from(new Set(SEED_PRODUCTS.map((p) => p.brand).filter((b): b is string => Boolean(b)))).sort();
}
