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
import { ProductReviews } from "@/components/product/ProductReviews";
import { RichText, toPlainText } from "@/components/ui/RichText";
import { getProductBySlug, getRelatedProducts } from "@/lib/data/products";
import { getCategoryBySlug } from "@/lib/data/categories";
import { getProductReviews, getMyReview } from "@/lib/data/reviews";
import { getCurrentUser } from "@/lib/data/auth";
import { COMES_WITH } from "@/lib/spec-templates";
import { breadcrumbJsonLd, productJsonLd } from "@/lib/seo";
import { canonical } from "@/lib/site";

function deliveryWindow(): string {
  const fmt = (d: Date) => d.toLocaleDateString("en-KE", { month: "short", day: "numeric" });
  const from = new Date();
  from.setDate(from.getDate() + 1);
  const to = new Date();
  to.setDate(to.getDate() + 2);
  return `${fmt(from)} – ${fmt(to)}`;
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  const metaDescription = product.description ? toPlainText(product.description, 160) : undefined;
  return {
    title: product.name,
    description: metaDescription,
    alternates: canonical(`/product/${product.slug}`),
    openGraph: {
      title: product.name,
      description: metaDescription,
      images: product.images.map((img) => ({ url: img.url, alt: img.alt })),
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [category, related, reviews, currentUser, myReview] = await Promise.all([
    getCategoryBySlug(product.category_slug),
    getRelatedProducts(product, 10),
    getProductReviews(product.id),
    getCurrentUser(),
    getMyReview(product.id),
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
            {product.review_count > 0 ? (
              <StarRating rating={product.rating} reviewCount={product.review_count} />
            ) : (
              <span className="text-body-sm text-on-surface-variant">No reviews yet</span>
            )}
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
              { icon: "local_shipping", text: "Free same-day Nairobi delivery" },
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
            <RichText content={product.description} className="pb-2 pt-3" />
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

      </div>

      <ProductReviews
        productId={product.id}
        slug={product.slug}
        reviews={reviews}
        rating={product.rating}
        reviewCount={product.review_count}
        isLoggedIn={currentUser !== null}
        myReview={myReview}
      />

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-8 text-headline-lg font-bold text-on-surface">Similar Products</h2>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
