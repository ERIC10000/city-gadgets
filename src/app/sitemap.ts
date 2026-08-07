import type { MetadataRoute } from "next";
import { getCategories } from "@/lib/data/categories";
import { getProducts } from "@/lib/data/products";
import { getGuides } from "@/lib/data/guides";

import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, { items: products }] = await Promise.all([
    getCategories(),
    getProducts({ limit: 1000 }),
  ]);
  const guides = getGuides();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/shop`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/deals`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/guides`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/repair`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/sell`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/inspiration`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.6 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${SITE_URL}/category/${c.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/product/${p.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const guideRoutes: MetadataRoute.Sitemap = guides.map((g) => ({
    url: `${SITE_URL}/guides/${g.slug}`,
    lastModified: g.updatedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...guideRoutes];
}
