"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { signOut } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/account", icon: "dashboard", label: "Dashboard" },
  { href: "/account/orders", icon: "package_2", label: "Orders" },
  { href: "/account/addresses", icon: "location_on", label: "Addresses" },
  { href: "/account/settings", icon: "settings", label: "Settings" },
];

export function AccountSidebar({ loyaltyPoints }: { loyaltyPoints: number }) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col gap-6 md:flex">
      <nav className="space-y-1">
        {NAV.map((item) => {
          const active = pathname === item.href;
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
        <hr className="my-2 border-outline-variant" />
        <form action={signOut}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 font-semibold text-error transition-colors hover:bg-error-container"
          >
            <Icon name="logout" />
            Sign Out
          </button>
        </form>
      </nav>

      <div className="relative overflow-hidden rounded-2xl bg-primary p-6 text-white">
        <Icon name="electric_bolt" filled className="absolute -bottom-4 -right-4 !text-[100px] opacity-20" />
        <p className="text-body-sm opacity-80">Loyalty Points</p>
        <p className="text-3xl font-extrabold">{loyaltyPoints.toLocaleString()}</p>
        <button className="mt-4 rounded-lg bg-white px-4 py-2 text-body-sm font-bold text-primary">Redeem Now</button>
      </div>
    </aside>
  );
}
