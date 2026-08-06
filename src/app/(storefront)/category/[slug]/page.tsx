import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CategoryListing, type ListingSearchParams } from "@/components/product/CategoryListing";
import { getCategoryBySlug } from "@/lib/data/categories";
import { getProducts } from "@/lib/data/products";
import { breadcrumbJsonLd, collectionPageJsonLd, categoryMetaTitle, categoryMetaDescription } from "@/lib/seo";
import { canonical } from "@/lib/site";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<ListingSearchParams>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: categoryMetaTitle(category.name),
    description: categoryMetaDescription(category.name),
    // Sort/filter params must not fragment this category's ranking signals.
    alternates: canonical(`/category/${slug}`),
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const resolvedSearchParams = await searchParams;
  const { items } = await getProducts({ categorySlug: slug, limit: 30 });

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: category.name, href: `/category/${slug}` },
  ]);
  const collection = collectionPageJsonLd({
    name: category.name,
    description: categoryMetaDescription(category.name),
    path: `/category/${slug}`,
    products: items.map((p) => ({ slug: p.slug, name: p.name })),
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collection) }} />
      <CategoryListing category={category} searchParams={resolvedSearchParams} basePath={`/category/${slug}`} />
    </>
  );
}
