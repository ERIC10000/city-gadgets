import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { ProductForm } from "@/components/vendor/ProductForm";
import { getCategories } from "@/lib/data/categories";
import { createProduct } from "@/lib/actions/products";

export const metadata: Metadata = { title: "New Product" };

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <Link href="/vendor/products" className="flex w-fit items-center gap-1 text-body-sm font-semibold text-on-surface-variant hover:text-secondary">
        <Icon name="arrow_back" className="text-[18px]" />
        Back to Products
      </Link>
      <div>
        <h1 className="text-2xl font-extrabold text-on-surface">New Product</h1>
        <p className="text-body-sm text-on-surface-variant">Fill in the details below — publish when you&apos;re ready.</p>
      </div>
      <ProductForm categories={categories} action={createProduct} />
    </div>
  );
}
