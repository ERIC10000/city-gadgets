import Image from "next/image";
import { Breadcrumbs } from "@/components/product/Breadcrumbs";
import { FilterSidebar } from "@/components/product/FilterSidebar";
import { SortDropdown } from "@/components/product/SortDropdown";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Pagination } from "@/components/ui/Pagination";
import { getProducts, type ProductSort } from "@/lib/data/products";
import type { Category } from "@/lib/types";

const PAGE_SIZE = 9;

export type ListingSearchParams = {
  sort?: string;
  brand?: string | string[];
  min?: string;
  max?: string;
  page?: string;
  search?: string;
};

export async function CategoryListing({
  category,
  searchParams,
  basePath,
}: {
  category?: Category;
  searchParams: ListingSearchParams;
  basePath: string;
}) {
  const brands = Array.isArray(searchParams.brand)
    ? searchParams.brand
    : searchParams.brand
      ? [searchParams.brand]
      : [];
  const page = Math.max(1, Number(searchParams.page) || 1);
  const minPrice = searchParams.min ? Number(searchParams.min) : undefined;
  const maxPrice = searchParams.max ? Number(searchParams.max) : undefined;

  const { items, total } = await getProducts({
    categorySlug: category?.slug,
    brands: brands.length ? brands : undefined,
    minPrice,
    maxPrice,
    search: searchParams.search,
    sort: (searchParams.sort as ProductSort) ?? "featured",
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  });

  // Brand list scoped to this category's full catalog (unfiltered by price/brand)
  // so checking one brand doesn't make the others disappear from the sidebar.
  const { items: allInScope } = await getProducts({ categorySlug: category?.slug, limit: 1000 });
  const brandOptions = Array.from(new Set(allInScope.map((p) => p.brand).filter((b): b is string => Boolean(b)))).sort();
  const prices = allInScope.map((p) => p.price);
  const priceBounds = { min: prices.length ? Math.min(...prices) : 0, max: prices.length ? Math.max(...prices) : 0 };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function makeHref(targetPage: number) {
    const params = new URLSearchParams();
    if (searchParams.sort) params.set("sort", searchParams.sort);
    brands.forEach((b) => params.append("brand", b));
    if (searchParams.min) params.set("min", searchParams.min);
    if (searchParams.max) params.set("max", searchParams.max);
    if (searchParams.search) params.set("search", searchParams.search);
    if (targetPage > 1) params.set("page", String(targetPage));
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  return (
    <div className="mx-auto w-full max-w-container-max px-margin-mobile py-8 md:px-gutter">
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Shop", href: "/shop" },
          ...(category ? [{ name: category.name }] : searchParams.search ? [{ name: `"${searchParams.search}"` }] : []),
        ]}
      />

      {category && (
        <div className="relative my-8 flex min-h-[320px] items-end overflow-hidden rounded-3xl bg-inverse-surface px-8 py-12 text-white md:min-h-[420px] md:px-16 md:py-16">
          {category.hero_image && (
            <Image
              src={category.hero_image}
              alt={category.name}
              fill
              sizes="100vw"
              priority
              className="hero-kenburns object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface via-inverse-surface/60 to-inverse-surface/10" />
          <div className="relative z-10 max-w-2xl">
            <p className="mb-3 text-label-caps font-bold text-primary-fixed">{category.name.toUpperCase()}</p>
            <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">{category.hero_tagline}</h1>
            <p className="mt-4 text-body-md text-white/70">
              {total} genuine {total === 1 ? "product" : "products"} · M-Pesa · Same-day Nairobi delivery
            </p>
          </div>
        </div>
      )}

      <div className="mb-6 mt-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-body-sm text-on-surface-variant">
          {total} {total === 1 ? "result" : "results"} found
        </p>
        <SortDropdown />
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <FilterSidebar brands={brandOptions} priceBounds={priceBounds} />
        <div className="flex-1 space-y-10">
          <ProductGrid products={items} />
          <Pagination current={page} total={totalPages} makeHref={makeHref} />
        </div>
      </div>
    </div>
  );
}
