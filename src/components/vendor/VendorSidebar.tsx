"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { signOut } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/vendor", icon: "dashboard", label: "Dashboard" },
  { href: "/vendor/products", icon: "inventory_2", label: "Products" },
  { href: "/vendor/videos", icon: "smart_display", label: "Video Inspiration" },
];

export function VendorSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col justify-between border-r border-outline-variant bg-surface-container-lowest p-4 md:flex">
      <div>
        <Link href="/vendor" className="mb-8 flex items-center gap-2 px-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
            <Icon name="storefront" filled />
          </span>
          <span className="font-bold text-on-surface">Vendor Studio</span>
        </Link>
        <nav className="space-y-1">
          {NAV.map((item) => {
            const active = item.href === "/vendor" ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 font-semibold transition-colors",
                  active ? "bg-primary-container text-on-primary-container" : "text-on-surface-variant hover:bg-surface-container-high",
                )}
              >
                <Icon name={item.icon} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-4 py-3 font-semibold text-on-surface-variant transition-colors hover:bg-surface-container-high"
        >
          <Icon name="storefront" />
          View Storefront
        </Link>
        <form action={signOut}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 font-semibold text-error transition-colors hover:bg-error-container"
          >
            <Icon name="logout" />
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}
