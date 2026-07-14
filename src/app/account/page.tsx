import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { MenuRow } from "@/components/ui/MenuRow";
import { formatDate, formatKES } from "@/lib/format";
import { whatsappLink } from "@/lib/contact";
import { getCurrentUser } from "@/lib/data/auth";
import { getOrdersForUser, orderStats } from "@/lib/data/orders";

export const metadata: Metadata = { title: "My Account" };

export default async function AccountPage() {
  const current = await getCurrentUser();
  if (!current) return null; // layout already redirects unauthenticated visitors

  const orders = await getOrdersForUser(current.profile.id, 5);
  const { totalOrders, inTransit, totalSpent } = orderStats(orders);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-on-surface md:text-headline-lg">
            Welcome back, {current.profile.full_name?.split(" ")[0] ?? "there"}
          </h1>
          <p className="text-on-surface-variant">{current.email}</p>
        </div>
        <Link
          href="/account/settings"
          className="w-fit rounded-lg border border-outline-variant px-4 py-2 text-body-sm font-bold text-on-surface hover:border-primary hover:text-primary"
        >
          Edit Profile
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-card">
          <Icon name="package_2" filled className="mb-3 text-primary" />
          <p className="text-2xl font-extrabold text-on-surface">{totalOrders}</p>
          <p className="text-body-sm text-on-surface-variant">Active Orders</p>
        </div>
        <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-card">
          <Icon name="local_shipping" filled className="mb-3 text-secondary" />
          <p className="text-2xl font-extrabold text-on-surface">{inTransit}</p>
          <p className="text-body-sm text-on-surface-variant">In Transit</p>
        </div>
        <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-card">
          <Icon name="account_balance_wallet" filled className="mb-3 text-price-gold" />
          <p className="text-2xl font-extrabold text-on-surface">{formatKES(totalSpent)}</p>
          <p className="text-body-sm text-on-surface-variant">Total Spent</p>
        </div>
      </div>

      <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold text-on-surface">Recent Orders</h2>
          <Link href="/account/orders" className="text-body-sm font-bold text-primary hover:underline">
            View All
          </Link>
        </div>
        {orders.length === 0 ? (
          <p className="py-8 text-center text-body-sm text-on-surface-variant">
            No orders yet — your City Gadgets purchases will show up here.
          </p>
        ) : (
          <div className="divide-y divide-outline-variant">
            {orders.map((order) => (
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-4 rounded-2xl border-l-4 border-whatsapp-green bg-surface-container-lowest p-5 shadow-card"
        >
          <Icon name="support_agent" className="text-whatsapp-green" />
          <div className="flex-1">
            <p className="font-bold text-on-surface">Need help?</p>
            <p className="text-body-sm text-on-surface-variant">Chat with support on WhatsApp</p>
          </div>
          <Icon name="chevron_right" className="text-on-surface-variant" />
        </a>
        <Link
          href="/account/addresses"
          className="flex items-center gap-4 rounded-2xl border-l-4 border-primary bg-surface-container-lowest p-5 shadow-card"
        >
          <Icon name="location_on" className="text-primary" />
          <div className="flex-1">
            <p className="font-bold text-on-surface">Shipping Addresses</p>
            <p className="text-body-sm text-on-surface-variant">Manage delivery locations</p>
          </div>
          <Icon name="chevron_right" className="text-on-surface-variant" />
        </Link>
      </div>

      <div className="space-y-3 md:hidden">
        <p className="text-label-caps font-bold text-on-surface-variant">Account Management</p>
        <MenuRow href="/account/orders" icon="shopping_bag" label="My Orders" />
        <MenuRow href="/account/addresses" icon="location_on" label="Shipping Addresses" />
        <MenuRow href="/account/settings" icon="settings" label="Account Settings" />
      </div>
    </div>
  );
}
