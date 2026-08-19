import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { GuideForm } from "@/components/vendor/GuideForm";
import { getCategories } from "@/lib/data/categories";
import { createGuide } from "@/lib/actions/guides";

export const metadata: Metadata = { title: "New Guide" };

export default async function NewGuidePage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/vendor/guides" className="inline-flex items-center gap-1 text-body-sm font-semibold text-on-surface-variant hover:text-on-surface">
          <Icon name="arrow_back" className="text-[18px]" /> Back to guides
        </Link>
        <h1 className="mt-2 text-2xl font-extrabold text-on-surface md:text-headline-lg">Write a buying guide</h1>
        <p className="text-on-surface-variant">Publish honest, keyword-rich advice — it appears at /guides with a live product grid.</p>
      </div>
      <GuideForm action={createGuide} categories={categories.map((c) => ({ slug: c.slug, name: c.name }))} />
    </div>
  );
}
