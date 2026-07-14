"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { signOut } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/vendor", icon: "dashboard", label: "Dashboard", exact: true },
  { href: "/vendor/orders", icon: "shopping_bag", label: "Orders", exact: false },
  { href: "/vendor/products", icon: "inventory_2", label: "Products", exact: false },
  { href: "/vendor/categories", icon: "category", label: "Categories", exact: false },
  { href: "/vendor/deals", icon: "local_offer", label: "Deals & Banners", exact: false },
  { href: "/vendor/videos", icon: "smart_display", label: "Video Inspiration", exact: false },
  { href: "/vendor/customers", icon: "group", label: "Customers", exact: false },
  { href: "/vendor/settings", icon: "settings", label: "Settings", exact: false },
];

export function VendorSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col justify-between bg-inverse-surface text-inverse-on-surface p-4 md:flex">
      <div>
        <Link href="/vendor" className="mb-8 flex items-center gap-2 px-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-container text-on-primary-container">
            <Icon name="storefront" filled />
          </span>
          <span className="font-bold text-white tracking-wide">Vendor Studio</span>
        </Link>
        <nav className="space-y-1">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-container"
                    : "text-inverse-on-surface/70 hover:bg-white/10 hover:text-white",
                )}
              >
                <Icon name={item.icon} className={active ? "text-primary-container" : ""} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-4 py-3 font-medium text-inverse-on-surface/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          <Icon name="storefront" />
          View Storefront
        </Link>
        <form action={signOut}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 font-medium text-error transition-colors hover:bg-error/10 hover:text-error"
          >
            <Icon name="logout" />
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}
