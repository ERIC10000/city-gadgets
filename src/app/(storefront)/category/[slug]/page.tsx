import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CategoryListing, type ListingSearchParams } from "@/components/product/CategoryListing";
import { getCategoryBySlug } from "@/lib/data/categories";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<ListingSearchParams>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: category.name,
    description: category.hero_tagline ?? `Shop ${category.name} at City Gadgets — genuine tech, M-Pesa payments, same-day Nairobi delivery.`,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const resolvedSearchParams = await searchParams;
  return <CategoryListing category={category} searchParams={resolvedSearchParams} basePath={`/category/${slug}`} />;
}
