import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { CartBadge } from "@/components/cart/CartBadge";

const ITEMS = [
  { href: "/", icon: "home", label: "Home" },
  { href: "/shop", icon: "grid_view", label: "Categories" },
  { href: "/cart", icon: "shopping_cart", label: "Cart" },
  { href: "/account", icon: "person", label: "Account" },
];

export function MobileBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around border-t border-outline-variant bg-surface px-4 py-2 shadow-card-lg md:hidden">
      {ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="relative flex flex-col items-center justify-center gap-0.5 p-1 text-on-surface-variant transition-all active:scale-95"
        >
          <Icon name={item.icon} />
          {item.href === "/cart" && <CartBadge />}
          <span className="text-[10px] font-bold uppercase tracking-wide">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
