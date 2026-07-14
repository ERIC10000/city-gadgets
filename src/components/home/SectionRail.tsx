import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/lib/types";

export function SectionRail({
  title,
  href,
  products,
  tone = "light",
}: {
  title: string;
  href: string;
  products: Product[];
  tone?: "light" | "gray";
}) {
  if (!products.length) return null;
  return (
    <section className={tone === "gray" ? "bg-surface-off-white py-12" : "py-12"}>
      <div className="mx-auto w-full max-w-container-max px-margin-mobile md:px-gutter">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-on-surface md:text-2xl">{title}</h2>
          <Link href={href} className="flex items-center gap-1 text-body-sm font-semibold text-on-surface hover:text-secondary">
            See all <Icon name="chevron_right" className="text-[18px]" />
          </Link>
        </div>
        <div className="no-scrollbar scrollbar-thin -mx-1 flex gap-4 overflow-x-auto px-1 pb-2">
          {products.map((p) => (
            <div key={p.id} className="w-[220px] shrink-0">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
