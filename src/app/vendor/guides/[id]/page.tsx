import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { GuideForm } from "@/components/vendor/GuideForm";
import { getCategories } from "@/lib/data/categories";
import { getVendorGuide } from "@/lib/data/guides";
import { updateGuide } from "@/lib/actions/guides";

export const metadata: Metadata = { title: "Edit Guide" };

type Props = { params: Promise<{ id: string }> };

export default async function EditGuidePage({ params }: Props) {
  const { id } = await params;
  const [guide, categories] = await Promise.all([getVendorGuide(id), getCategories()]);
  if (!guide) notFound();

  const action = updateGuide.bind(null, id);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/vendor/guides" className="inline-flex items-center gap-1 text-body-sm font-semibold text-on-surface-variant hover:text-on-surface">
          <Icon name="arrow_back" className="text-[18px]" /> Back to guides
        </Link>
        <h1 className="mt-2 text-2xl font-extrabold text-on-surface md:text-headline-lg">Edit guide</h1>
        <p className="text-on-surface-variant">Update the copy, cover or featured products — changes go live immediately.</p>
      </div>
      <GuideForm action={action} categories={categories.map((c) => ({ slug: c.slug, name: c.name }))} initial={guide} />
    </div>
  );
}
