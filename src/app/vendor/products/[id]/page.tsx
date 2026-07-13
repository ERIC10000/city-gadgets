import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { ProductForm } from "@/components/vendor/ProductForm";
import { getCategories } from "@/lib/data/categories";
import { getCurrentUser } from "@/lib/data/auth";
import { getVendorProduct } from "@/lib/data/vendor";
import { updateProduct } from "@/lib/actions/products";

export const metadata: Metadata = { title: "Edit Product" };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const current = await getCurrentUser();
  if (!current) return null;

  const [product, categories] = await Promise.all([getVendorProduct(current.profile.id, id), getCategories()]);
  if (!product) notFound();

  const updateWithId = updateProduct.bind(null, id);

  return (
    <div className="space-y-6">
      <Link href="/vendor/products" className="flex w-fit items-center gap-1 text-body-sm font-semibold text-on-surface-variant hover:text-primary">
        <Icon name="arrow_back" className="text-[18px]" />
        Back to Products
      </Link>
      <h1 className="text-2xl font-extrabold text-on-surface md:text-headline-lg">Edit Product</h1>
      <ProductForm categories={categories} product={product} action={updateWithId} />
    </div>
  );
}
