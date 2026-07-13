import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { CartBadge } from "@/components/cart/CartBadge";
import { NavLink } from "@/components/layout/NavLink";
import { LogoMark } from "@/components/layout/LogoMark";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/category/consoles", label: "Gaming" },
  { href: "/category/phones", label: "Phones" },
  { href: "/category/macbooks", label: "Apple" },
  { href: "/category/wearables", label: "Wearables" },
  { href: "/inspiration", label: "Inspiration" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-outline-variant/60 bg-surface/95 backdrop-blur transition-all">
      <div className="mx-auto flex w-full max-w-container-max flex-col gap-2 px-margin-mobile py-4 md:px-gutter">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <LogoMark />
            <span className="whitespace-nowrap text-xl font-extrabold tracking-tight text-primary md:text-headline-lg-mobile">
              City Gadgets
            </span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.href} href={link.href} label={link.label} />
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <form action="/shop" className="hidden items-center rounded-full bg-surface-container-low px-4 py-2 lg:flex">
              <Icon name="search" className="text-on-surface-variant" />
              <input
                type="search"
                name="search"
                placeholder="Search gadgets…"
                className="ml-2 w-40 bg-transparent text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none xl:w-56"
              />
            </form>
            <Link
              href="/shop"
              className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-high lg:hidden"
              aria-label="Search"
            >
              <Icon name="search" />
            </Link>
            <Link
              href="/cart"
              className="relative rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-high"
              aria-label="Cart"
            >
              <Icon name="shopping_cart" />
              <CartBadge />
            </Link>
            <Link
              href="/account"
              className="hidden items-center gap-2 rounded-lg bg-primary px-4 py-2 text-label-caps font-bold text-on-primary transition-all hover:opacity-90 md:flex"
            >
              <Icon name="person" className="text-[18px]" />
              Account
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
