import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { formatKES } from "@/lib/format";
import type { Product } from "@/lib/types";

export function FeaturedDeals({ products }: { products: Product[] }) {
  if (products.length === 0) return null;
  const [hero, ...rest] = products;
  const heroDiscount =
    hero.compare_at_price && hero.compare_at_price > hero.price
      ? Math.round(((hero.compare_at_price - hero.price) / hero.compare_at_price) * 100)
      : 0;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
      {/* Large hero deal */}
      <Link
        href={`/product/${hero.slug}`}
        className="group flex flex-col justify-between rounded-2xl border border-outline-variant bg-white p-6 transition-shadow hover:shadow-card-lg lg:col-span-2 lg:flex-row lg:items-center"
      >
        <div className="relative h-56 w-full lg:h-64 lg:w-1/2">
          {hero.images[0] && (
            <Image
              src={hero.images[0].url}
              alt={hero.name}
              fill
              sizes="(max-width:1024px) 100vw, 300px"
              className="object-contain transition-transform duration-500 group-hover:scale-105"
              priority
            />
          )}
        </div>
        <div className="lg:w-1/2 lg:pl-6">
          <h3 className="text-lg font-bold leading-snug text-on-surface">{hero.name}</h3>
          {heroDiscount > 0 && (
            <p className="mt-3 text-body-sm text-on-surface-variant">
              new <span className="line-through">{formatKES(hero.compare_at_price!)}</span>
            </p>
          )}
          <div className="mt-1 flex items-center gap-2">
            <span className="text-2xl font-extrabold text-on-surface">{formatKES(hero.price)}</span>
            {heroDiscount > 0 && (
              <span className="rounded bg-discount-bg px-2 py-0.5 text-body-sm font-bold text-discount">-{heroDiscount}%</span>
            )}
          </div>
          <span className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-on-surface px-6 py-3 text-body-sm font-bold text-white transition-transform group-hover:scale-[1.02] lg:w-auto lg:px-8">
            Shop Now
          </span>
        </div>
      </Link>

      {rest.slice(0, 2).map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
      {rest.slice(2, 6).map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
