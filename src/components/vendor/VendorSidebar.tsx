"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { signOut } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

type NavItem = { href: string; icon: string; label: string; exact?: boolean };

const SECTIONS: { label: string; items: NavItem[] }[] = [
  {
    label: "Overview",
    items: [
      { href: "/vendor", icon: "dashboard", label: "Dashboard", exact: true },
      { href: "/vendor/orders", icon: "shopping_bag", label: "Orders" },
    ],
  },
  {
    label: "Catalog",
    items: [
      { href: "/vendor/products", icon: "inventory_2", label: "Products" },
      { href: "/vendor/categories", icon: "category", label: "Categories" },
      { href: "/vendor/deals", icon: "local_offer", label: "Deals & Banners" },
      { href: "/vendor/videos", icon: "smart_display", label: "Video Inspiration" },
    ],
  },
  {
    label: "People",
    items: [{ href: "/vendor/customers", icon: "group", label: "Customers" }],
  },
  {
    label: "System",
    items: [{ href: "/vendor/settings", icon: "settings", label: "Settings" }],
  },
];

const ALL_ITEMS = SECTIONS.flatMap((s) => s.items);

function isActive(pathname: string, item: NavItem) {
  return item.exact ? pathname === item.href : pathname.startsWith(item.href);
}

export function VendorSidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col bg-inverse-surface text-inverse-on-surface md:flex">
        <Link href="/vendor" className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-container text-on-primary-container">
            <Icon name="storefront" filled />
          </span>
          <span>
            <span className="block font-extrabold tracking-wide text-white">Vendor Studio</span>
            <span className="block text-badge-text text-white/50">City Gadgets Admin</span>
          </span>
        </Link>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-6">
          {SECTIONS.map((section) => (
            <div key={section.label}>
              <p className="mb-2 px-3 text-badge-text font-bold uppercase tracking-widest text-white/40">
                {section.label}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const active = isActive(pathname, item);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-body-sm font-medium transition-colors",
                        active ? "bg-white/[0.08] text-white" : "text-white/60 hover:bg-white/5 hover:text-white",
                      )}
                    >
                      <span
                        className={cn(
                          "absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary-container transition-opacity",
                          active ? "opacity-100" : "opacity-0",
                        )}
                      />
                      <Icon
                        name={item.icon}
                        className={cn("text-[20px]", active ? "text-primary-container" : "text-white/50 group-hover:text-white/80")}
                      />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="space-y-0.5 border-t border-white/10 px-3 py-4">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-body-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white"
          >
            <Icon name="open_in_new" className="text-[20px] text-white/50" />
            View Storefront
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-body-sm font-medium text-red-300/80 transition-colors hover:bg-red-500/10 hover:text-red-300"
            >
              <Icon name="logout" className="text-[20px]" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile horizontal nav */}
      <nav className="no-scrollbar sticky top-0 z-30 flex gap-2 overflow-x-auto border-b border-outline-variant bg-inverse-surface px-4 py-3 md:hidden">
        {ALL_ITEMS.map((item) => {
          const active = isActive(pathname, item);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-badge-text font-bold transition-colors",
                active ? "bg-primary-container text-on-primary-container" : "bg-white/10 text-white/70",
              )}
            >
              <Icon name={item.icon} className="text-[16px]" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
