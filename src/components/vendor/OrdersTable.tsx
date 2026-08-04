"use client";

import { Fragment, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatKES } from "@/lib/format";
import { updateOrderStatus } from "@/lib/actions/vendor-orders";
import type { OrderStatus } from "@/lib/types";
import type { AdminOrder } from "@/lib/data/orders";

const STATUS_OPTIONS: OrderStatus[] = ["pending", "processing", "shipped", "delivered", "cancelled"];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" });
}

export function OrdersTable({ orders }: { orders: AdminOrder[] }) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="overflow-x-auto rounded-2xl bg-surface-container-lowest shadow-card">
      <table className="w-full text-left">
        <thead className="border-b border-outline-variant text-body-sm text-on-surface-variant">
          <tr>
            <th className="px-5 py-4 font-semibold">Order</th>
            <th className="px-5 py-4 font-semibold">Customer</th>
            <th className="px-5 py-4 font-semibold">Date</th>
            <th className="px-5 py-4 font-semibold">Total</th>
            <th className="px-5 py-4 font-semibold">Payment</th>
            <th className="px-5 py-4 font-semibold">Status</th>
            <th className="px-5 py-4 text-right font-semibold">Update</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/40">
          {orders.map((order) => {
            const expanded = open === order.id;
            const address = order.shipping_address ?? {};
            const addressLine = Object.values(address).filter(Boolean).join(", ");
            return (
              <Fragment key={order.id}>
                <tr className="cursor-pointer transition-colors hover:bg-surface-container" onClick={() => setOpen(expanded ? null : order.id)}>
                  <td className="px-5 py-4">
                    <span className="flex items-center gap-1.5 font-mono text-body-sm text-on-surface-variant">
                      <Icon name={expanded ? "expand_more" : "chevron_right"} className="text-[18px]" />
                      #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-on-surface">{order.customer?.name ?? "Guest"}</p>
                    {order.customer?.phone && <p className="text-badge-text text-on-surface-variant">{order.customer.phone}</p>}
                  </td>
                  <td className="px-5 py-4 text-on-surface-variant">{formatDate(order.created_at)}</td>
                  <td className="px-5 py-4 font-bold text-on-surface">{formatKES(order.total)}</td>
                  <td className="px-5 py-4 capitalize text-on-surface-variant">{order.payment_method ?? "—"}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                    <form action={updateOrderStatus} className="flex justify-end">
                      <input type="hidden" name="id" value={order.id} />
                      <select
                        name="status"
                        defaultValue={order.status}
                        onChange={(e) => e.currentTarget.form?.requestSubmit()}
                        className="rounded-lg border border-outline-variant bg-surface px-3 py-1.5 text-body-sm font-semibold capitalize text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s} className="capitalize">
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </option>
                        ))}
                      </select>
                    </form>
                  </td>
                </tr>

                {expanded && (
                  <tr className="bg-surface-container-low">
                    <td colSpan={7} className="px-5 py-4">
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {/* Items */}
                        <div className="md:col-span-2">
                          <p className="mb-2 text-badge-text font-bold uppercase tracking-wide text-on-surface-variant">Items</p>
                          <ul className="divide-y divide-outline-variant/50 rounded-xl border border-outline-variant bg-white">
                            {(order.items ?? []).map((it) => (
                              <li key={it.id} className="flex items-center justify-between gap-3 px-4 py-2.5">
                                <span className="text-body-sm text-on-surface">
                                  {it.product_name} <span className="text-on-surface-variant">× {it.quantity}</span>
                                </span>
                                <span className="text-body-sm font-bold text-on-surface">{formatKES(it.unit_price * it.quantity)}</span>
                              </li>
                            ))}
                            {(order.items ?? []).length === 0 && (
                              <li className="px-4 py-3 text-body-sm text-on-surface-variant">No line items recorded.</li>
                            )}
                          </ul>
                        </div>

                        {/* Delivery + totals */}
                        <div className="space-y-3 text-body-sm">
                          <div>
                            <p className="text-badge-text font-bold uppercase tracking-wide text-on-surface-variant">Deliver to</p>
                            <p className="mt-1 text-on-surface">{order.customer?.name ?? "Guest"}</p>
                            {order.phone_number && <p className="text-on-surface-variant">{order.phone_number}</p>}
                            {addressLine && <p className="text-on-surface-variant">{addressLine}</p>}
                          </div>
                          <div className="border-t border-outline-variant/60 pt-2">
                            <div className="flex justify-between text-on-surface-variant">
                              <span>Subtotal</span>
                              <span>{formatKES(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-on-surface-variant">
                              <span>Shipping</span>
                              <span>{formatKES(order.shipping_fee)}</span>
                            </div>
                            <div className="mt-1 flex justify-between font-bold text-on-surface">
                              <span>Total</span>
                              <span>{formatKES(order.total)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
