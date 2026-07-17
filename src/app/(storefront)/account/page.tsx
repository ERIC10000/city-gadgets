import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate, formatKES } from "@/lib/format";
import { whatsappLink } from "@/lib/contact";
import { getCurrentUser } from "@/lib/data/auth";
import { getOrdersForUser, orderStats } from "@/lib/data/orders";

export const metadata: Metadata = { title: "My Account" };

const QUICK_ACTIONS = [
  { href: "/account/orders", icon: "shopping_bag", title: "My Orders", sub: "Track, return or buy again" },
  { href: "/account/addresses", icon: "location_on", title: "Addresses", sub: "Manage delivery locations" },
  { href: "/account/settings", icon: "manage_accounts", title: "Profile & Security", sub: "Name, phone, password" },
  { href: "/deals", icon: "local_fire_department", title: "Hot Deals", sub: "Up to 68% off today" },
  { href: "/sell", icon: "currency_exchange", title: "Sell Your Device", sub: "Trade in for instant M-Pesa" },
  { href: whatsappLink(), icon: "support_agent", title: "WhatsApp Support", sub: "We reply within minutes", external: true },
] as const;

export default async function AccountPage() {
  const current = await getCurrentUser();
  if (!current) return null; // layout already redirects unauthenticated visitors

  const orders = await getOrdersForUser(current.profile.id, 8);
  const { totalOrders, inTransit, totalSpent } = orderStats(orders);
  const delivered = orders.filter((o) => o.status === "delivered").length;

  const stats = [
    { icon: "package_2", tone: "text-primary", value: String(totalOrders), label: "Total Orders" },
    { icon: "local_shipping", tone: "text-secondary", value: String(inTransit), label: "In Transit" },
    { icon: "task_alt", tone: "text-m-pesa-green", value: String(delivered), label: "Delivered" },
    { icon: "account_balance_wallet", tone: "text-price-gold", value: formatKES(totalSpent), label: "Total Spent" },
  ];

  return (
    <div className="space-y-8">
      {/* Header card */}
      <div className="flex flex-col gap-4 rounded-2xl bg-inverse-surface p-6 text-white md:flex-row md:items-center md:justify-between md:p-8">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-price-gold text-xl font-extrabold text-inverse-surface">
            {(current.profile.full_name ?? current.email ?? "U").slice(0, 1).toUpperCase()}
          </span>
          <div>
            <h1 className="text-xl font-extrabold md:text-2xl">
              Welcome back, {current.profile.full_name?.split(" ")[0] ?? "there"}
            </h1>
            <p className="text-body-sm text-white/60">{current.email}</p>
          </div>
        </div>
        <Link
          href="/account/settings"
          className="w-fit rounded-full border border-price-gold/60 px-5 py-2.5 text-body-sm font-bold text-price-gold transition-colors hover:bg-price-gold hover:text-inverse-surface"
        >
          Edit Profile
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-outline-variant bg-white p-5">
            <Icon name={s.icon} filled className={`mb-3 ${s.tone}`} />
            <p className="text-xl font-extrabold text-on-surface md:text-2xl">{s.value}</p>
            <p className="text-body-sm text-on-surface-variant">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="mb-4 font-bold text-on-surface">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {QUICK_ACTIONS.map((a) => (
            <Link
              key={a.title}
              href={a.href}
              target={"external" in a && a.external ? "_blank" : undefined}
              className="group flex items-center gap-4 rounded-2xl border border-outline-variant bg-white p-5 transition-all hover:border-transparent hover:shadow-card-lg"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-container-high text-on-primary-container">
                <Icon name={a.icon} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-on-surface">{a.title}</p>
                <p className="truncate text-body-sm text-on-surface-variant">{a.sub}</p>
              </div>
              <Icon name="chevron_right" className="text-on-surface-variant transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </div>

      {/* Recent orders */}
      <div className="rounded-2xl border border-outline-variant bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold text-on-surface">Recent Orders</h2>
          <Link href="/account/orders" className="text-body-sm font-bold text-secondary hover:underline">
            View All
          </Link>
        </div>
        {orders.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <Icon name="package_2" className="text-4xl text-on-surface-variant" />
            <p className="text-body-sm text-on-surface-variant">
              No orders yet — your City Gadgets purchases will show up here.
            </p>
            <Link href="/deals" className="rounded-full bg-on-surface px-6 py-2.5 text-body-sm font-bold text-white hover:opacity-90">
              Browse Hot Deals
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-outline-variant">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between gap-4 py-3">
                <div>
                  <p className="font-semibold text-on-surface">#{order.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-body-sm text-on-surface-variant">{formatDate(order.created_at)}</p>
                </div>
                <StatusBadge status={order.status} />
                <p className="font-bold text-on-surface">{formatKES(order.total)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
