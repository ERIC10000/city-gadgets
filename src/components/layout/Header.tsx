import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { CartBadge } from "@/components/cart/CartBadge";
import { LogoMark } from "@/components/layout/LogoMark";
import { SearchBar } from "@/components/layout/SearchBar";
import { AllItemsMenu } from "@/components/layout/AllItemsMenu";
import { getCategories } from "@/lib/data/categories";

// Reebelo-style category nav. Labels mirror the reference; each points at a real
// City Gadgets route (Home/Fashion swapped for Audio/Cameras which we stock).
const NAV_LINKS = [
  { href: "/deals", label: "Deals", flame: true },
  { href: "/category/phones", label: "Phones" },
  { href: "/category/macbooks", label: "Laptops and MacBooks" },
  { href: "/category/tablets", label: "Tablets and iPads" },
  { href: "/category/wearables", label: "Smartwatches" },
  { href: "/category/audio", label: "Audio" },
  { href: "/category/consoles", label: "Gaming" },
  { href: "/category/cameras", label: "Cameras" },
];

export async function Header() {
  const categories = await getCategories();

  return (
    <header className="sticky top-0 z-50 bg-white">
      {/* Row 1 — logo, search, utilities */}
      <div className="border-b border-outline-variant/70">
        <div className="mx-auto flex w-full max-w-container-max items-center gap-4 px-margin-mobile py-3 md:px-gutter">
          <Link href="/" className="flex shrink-0 items-center gap-2 text-on-surface">
            <LogoMark className="h-7 w-7" />
            <span className="text-xl font-extrabold tracking-tight">City Gadgets</span>
          </Link>

          <SearchBar className="mx-auto hidden w-full max-w-xl md:flex" />

          <div className="flex shrink-0 items-center gap-4 text-on-surface">
            <span className="hidden items-center gap-1.5 text-body-sm font-medium lg:flex">
              <span className="text-base">🇰🇪</span> EN
            </span>
            <Link href="/account" className="hidden text-body-sm font-medium hover:text-secondary lg:block">
              Need help?
            </Link>
            <Link href="/account" aria-label="Account" className="hover:text-secondary">
              <Icon name="account_circle" className="text-[26px]" />
            </Link>
            <Link href="/cart" aria-label="Cart" className="relative hover:text-secondary">
              <Icon name="shopping_cart" className="text-[26px]" />
              <CartBadge />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile search */}
      <div className="border-b border-outline-variant/70 px-margin-mobile py-2.5 md:hidden">
        <SearchBar />
      </div>

      {/* Row 2 — category nav */}
      <div className="hidden border-b border-outline-variant/70 md:block">
        <div className="mx-auto flex w-full max-w-container-max items-center justify-between px-margin-mobile md:px-gutter">
          <nav className="no-scrollbar flex items-center gap-6 overflow-x-auto">
            <AllItemsMenu categories={categories} />
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="flex shrink-0 items-center gap-1 whitespace-nowrap py-3 text-body-sm font-semibold text-on-surface transition-colors hover:text-secondary"
              >
                {link.label}
                {link.flame && <span aria-hidden>🔥</span>}
              </Link>
            ))}
          </nav>

          <Link
            href="/sell"
            className="shrink-0 whitespace-nowrap rounded-full border border-on-surface px-5 py-2 text-body-sm font-semibold text-on-surface transition-colors hover:bg-on-surface hover:text-white"
          >
            Sell Your Device
          </Link>
        </div>
      </div>
    </header>
  );
}
