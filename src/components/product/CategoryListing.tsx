import { Breadcrumbs } from "@/components/product/Breadcrumbs";
import { CategoryBanner } from "@/components/product/CategoryBanner";
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

  // Department hero photo — the category's curated image, with the gold cart
  // artwork backing the generic /shop and search views.
  const bannerImage = category?.hero_image ?? "/banners/cart-gold.jpg";
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

      <div className="my-8">
        <CategoryBanner
          title={category?.name ?? (searchParams.search ? `Results for "${searchParams.search}"` : "All Gadgets")}
          tagline={category?.hero_tagline ?? "Every department, one cart — premium tech for less."}
          image={bannerImage}
          productCount={total}
        />
      </div>

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
