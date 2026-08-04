import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import type { Order, OrderStatus } from "@/lib/types";

export async function getOrdersForUser(userId: string, limit?: number): Promise<Order[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  let query = supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error || !data) return [];

  return data.map((row) => ({
    ...(row as unknown as Order),
    items: (row as unknown as { order_items: Order["items"] }).order_items,
  }));
}

export type OrderCustomer = { name: string | null; phone: string | null };
export type AdminOrder = Order & { customer: OrderCustomer | null };

export async function getAllOrders(limit?: number): Promise<AdminOrder[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  let query = supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });
  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error || !data) return [];

  const orders = data.map((row) => ({
    ...(row as unknown as Order),
    items: (row as unknown as { order_items: Order["items"] }).order_items,
  }));

  // orders.user_id → auth.users, so there's no PostgREST relationship to
  // profiles; fetch the buyers' profiles and map them on.
  const userIds = [...new Set(orders.map((o) => o.user_id).filter(Boolean))] as string[];
  const profiles = new Map<string, { full_name: string | null; phone: string | null }>();
  if (userIds.length) {
    const { data: profs } = await supabase.from("profiles").select("id, full_name, phone").in("id", userIds);
    (profs ?? []).forEach((p) => {
      const row = p as { id: string; full_name: string | null; phone: string | null };
      profiles.set(row.id, { full_name: row.full_name, phone: row.phone });
    });
  }

  return orders.map((o) => {
    const p = o.user_id ? profiles.get(o.user_id) : null;
    return {
      ...o,
      customer: { name: p?.full_name ?? null, phone: p?.phone ?? o.phone_number ?? null },
    };
  });
}

export function orderStats(orders: Order[]) {
  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);
  const inTransit = orders.filter((o): o is Order & { status: OrderStatus } => o.status === "shipped" || o.status === "processing").length;
  return { totalOrders: orders.length, inTransit, totalSpent };
}

