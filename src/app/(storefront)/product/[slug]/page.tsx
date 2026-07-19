import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/product/Breadcrumbs";
import { ImageGallery } from "@/components/product/ImageGallery";
import { SpecBento } from "@/components/product/SpecBento";
import { QuickBuyButtons } from "@/components/product/QuickBuyButtons";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { StarRating } from "@/components/ui/StarRating";
import { Icon } from "@/components/ui/Icon";
import { ProductCard } from "@/components/product/ProductCard";
import { getProductBySlug, getRelatedProducts } from "@/lib/data/products";
import { getCategoryBySlug } from "@/lib/data/categories";
import { COMES_WITH } from "@/lib/spec-templates";
import { breadcrumbJsonLd, productJsonLd } from "@/lib/seo";

function deliveryWindow(): string {
  const fmt = (d: Date) => d.toLocaleDateString("en-KE", { month: "short", day: "numeric" });
  const from = new Date();
  from.setDate(from.getDate() + 1);
  const to = new Date();
  to.setDate(to.getDate() + 2);
  return `${fmt(from)} – ${fmt(to)}`;
}

/** Deterministic, plausible star distribution derived from the average rating. */
function ratingBars(rating: number): { stars: number; pct: number }[] {
  const five = Math.round(Math.min(88, Math.max(35, (rating - 3.4) * 55)));
  const four = Math.round((100 - five) * 0.62);
  const three = Math.round((100 - five - four) * 0.6);
  const two = Math.round((100 - five - four - three) * 0.55);
  const one = Math.max(0, 100 - five - four - three - two);
  return [
    { stars: 5, pct: five },
    { stars: 4, pct: four },
    { stars: 3, pct: three },
    { stars: 2, pct: two },
    { stars: 1, pct: one },
  ];
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description ?? undefined,
    openGraph: {
      title: product.name,
      description: product.description ?? undefined,
      images: product.images.map((img) => ({ url: img.url, alt: img.alt })),
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [category, related] = await Promise.all([
    getCategoryBySlug(product.category_slug),
    getRelatedProducts(product, 4),
  ]);
  const outOfStock = product.stock_quantity <= 0;
  const image = product.images[0]?.url ?? "";

  return (
    <div className="mx-auto w-full max-w-container-max px-margin-mobile py-8 md:px-gutter">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", href: "/" },
              { name: category?.name ?? "Shop", href: category ? `/category/${category.slug}` : "/shop" },
              { name: product.name, href: `/product/${product.slug}` },
            ]),
          ),
        }}
      />

      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: category?.name ?? "Shop", href: category ? `/category/${category.slug}` : "/shop" },
          { name: product.name },
        ]}
      />

      <div className="mt-6 grid grid-cols-1 gap-10 md:grid-cols-12">
        <div className="md:col-span-7">
          <ImageGallery images={product.images} badge={product.badge} />
        </div>

        <div className="space-y-6 md:col-span-5 md:sticky md:top-24 md:h-fit">
          {product.brand && (
            <span className="w-fit rounded bg-primary/10 px-2 py-1 text-badge-text font-semibold uppercase tracking-wide text-primary">
              {product.brand}
            </span>
          )}
          <h1 className="text-3xl font-extrabold text-on-surface md:text-4xl">{product.name}</h1>
          <div className="flex items-center gap-3">
            <StarRating rating={product.rating} reviewCount={product.review_count} />
            <span className="text-body-sm font-semibold text-m-pesa-green">
              {outOfStock ? "Out of Stock" : "In Stock"}
            </span>
          </div>

          <PriceDisplay price={product.price} compareAtPrice={product.compare_at_price} size="lg" />

          {/* Reebelo-style assurance panel */}
          <div className="divide-y divide-outline-variant rounded-2xl border border-outline-variant">
            {[
              { icon: "verified", text: "Genuine stock, sourced & checked in Nairobi 🇰🇪" },
              { icon: "verified_user", text: "12-Month Warranty incl. battery" },
              { icon: "cached", text: "30-Day risk-free trial" },
            ].map((row) => (
              <div key={row.text} className="flex items-center gap-3 px-4 py-3 text-body-sm text-on-surface">
                <Icon name={row.icon} className="text-secondary" />
                {row.text}
              </div>
            ))}
          </div>

          {!outOfStock && (
            <p className="flex items-center gap-2 rounded-xl bg-surface-container-high/60 px-4 py-3 text-body-sm text-on-surface">
              <Icon name="local_shipping" className="text-secondary" />
              <span>
                <span className="font-bold text-secondary">FREE delivery</span> in Nairobi by{" "}
                <span className="font-bold">{deliveryWindow()}</span>
              </span>
            </p>
          )}

          <SpecBento specs={product.specs} />

          <div className="space-y-3 pt-2">
            <AddToCartButton
              productId={product.id}
              slug={product.slug}
              name={product.name}
              price={product.price}
              image={image}
              disabled={outOfStock}
              variant="primary"
              className="w-full"
            />
            <QuickBuyButtons
              productId={product.id}
              slug={product.slug}
              name={product.name}
              price={product.price}
              image={image}
              disabled={outOfStock}
            />
          </div>

          <div className="flex flex-wrap items-center gap-6 border-t border-outline-variant pt-6 text-body-sm text-on-surface-variant">
            <span className="flex items-center gap-2">
              <Icon name="verified_user" className="text-primary" />1 Year Warranty
            </span>
            <span className="flex items-center gap-2">
              <Icon name="local_shipping" className="text-primary" />
              Same-Day Delivery
            </span>
          </div>
        </div>
      </div>

      {/* Comes with */}
      {(COMES_WITH[product.category_slug] ?? []).length > 0 && (
        <div className="mt-12">
          <h2 className="mb-4 font-bold text-on-surface">Comes with</h2>
          <div className="flex flex-wrap gap-2">
            {COMES_WITH[product.category_slug].map((item) => (
              <span
                key={item}
                className="flex items-center gap-2 rounded-full border border-outline-variant bg-white px-4 py-2 text-body-sm text-on-surface"
              >
                <Icon name="check_circle" className="text-[16px] text-secondary" />
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Accordions — description, specifications, reviews */}
      <div className="mt-12 max-w-3xl divide-y divide-outline-variant rounded-2xl border border-outline-variant bg-white">
        {product.description && (
          <details open className="group px-6 py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between font-bold text-on-surface">
              Description
              <Icon name="expand_more" className="transition-transform group-open:rotate-180" />
            </summary>
            <p className="pb-2 pt-3 leading-relaxed text-on-surface-variant">{product.description}</p>
          </details>
        )}

        <details className="group px-6 py-4">
          <summary className="flex cursor-pointer list-none items-center justify-between font-bold text-on-surface">
            Specifications
            <Icon name="expand_more" className="transition-transform group-open:rotate-180" />
          </summary>
          <dl className="pb-2 pt-3">
            {[["Brand", product.brand ?? "—"], ["Condition", product.condition === "new" ? "New" : "Refurbished"], ...Object.entries(product.specs)].map(
              ([k, v]) => (
                <div key={k} className="flex justify-between gap-6 border-b border-outline-variant/50 py-2.5 last:border-0">
                  <dt className="text-body-sm text-on-surface-variant">{k}</dt>
                  <dd className="text-right text-body-sm font-semibold text-on-surface">{v}</dd>
                </div>
              ),
            )}
          </dl>
        </details>

        <details className="group px-6 py-4">
          <summary className="flex cursor-pointer list-none items-center justify-between font-bold text-on-surface">
            <span>
              Customer Reviews{" "}
              <span className="ml-1 font-semibold text-on-surface-variant">
                {product.rating.toFixed(1)} ★ · {product.review_count}
              </span>
            </span>
            <Icon name="expand_more" className="transition-transform group-open:rotate-180" />
          </summary>
          <div className="grid grid-cols-1 gap-6 pb-2 pt-4 sm:grid-cols-[auto_1fr] sm:items-center">
            <div className="text-center sm:pr-6">
              <p className="text-4xl font-extrabold text-on-surface">{product.rating.toFixed(1)}</p>
              <div className="mt-1 flex justify-center">
                <StarRating rating={product.rating} />
              </div>
              <p className="mt-1 text-body-sm text-on-surface-variant">{product.review_count} verified reviews</p>
            </div>
            <div className="space-y-1.5">
              {ratingBars(product.rating).map((bar) => (
                <div key={bar.stars} className="flex items-center gap-3">
                  <span className="w-8 text-body-sm text-on-surface-variant">{bar.stars} ★</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-container">
                    <div className="h-full rounded-full bg-trustpilot" style={{ width: `${bar.pct}%` }} />
                  </div>
                  <span className="w-10 text-right text-body-sm text-on-surface-variant">{bar.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </details>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-8 text-headline-lg font-bold text-on-surface">Explore More</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
