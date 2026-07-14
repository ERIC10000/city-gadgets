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
import { breadcrumbJsonLd, productJsonLd } from "@/lib/seo";

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

      {product.description && (
        <div className="mt-16 max-w-3xl">
          <h2 className="mb-4 text-headline-lg font-bold text-on-surface">Description</h2>
          <p className="leading-relaxed text-on-surface-variant">{product.description}</p>
        </div>
      )}

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
