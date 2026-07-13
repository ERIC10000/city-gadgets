import type { Metadata } from "next";
import { CategoryListing, type ListingSearchParams } from "@/components/product/CategoryListing";

export const metadata: Metadata = {
  title: "Shop All Gadgets",
  description: "Browse every genuine gadget in stock at City Gadgets — gaming, audio, wearables, laptops, and more.",
};

export default async function ShopPage({ searchParams }: { searchParams: Promise<ListingSearchParams> }) {
  const resolvedSearchParams = await searchParams;
  return <CategoryListing searchParams={resolvedSearchParams} basePath="/shop" />;
}
