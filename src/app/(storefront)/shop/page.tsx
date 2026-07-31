import type { Metadata } from "next";
import { CategoryListing, type ListingSearchParams } from "@/components/product/CategoryListing";

import { canonical } from "@/lib/site";

export const metadata: Metadata = {
  title: "Shop All Gadgets",
  description: "Browse every genuine gadget in stock at City Gadgets — gaming, audio, wearables, laptops, and more.",
  // Sort/filter params produce endless variants of this page; they all
  // consolidate here.
  alternates: canonical("/shop"),
};

export default async function ShopPage({ searchParams }: { searchParams: Promise<ListingSearchParams> }) {
  const resolvedSearchParams = await searchParams;
  return <CategoryListing searchParams={resolvedSearchParams} basePath="/shop" />;
}
