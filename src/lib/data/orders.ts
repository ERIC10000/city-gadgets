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

export async function getAllOrders(limit?: number): Promise<Order[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  let query = supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });
  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error || !data) return [];

  return data.map((row) => ({
    ...(row as unknown as Order),
    items: (row as unknown as { order_items: Order["items"] }).order_items,
  }));
}

export function orderStats(orders: Order[]) {
  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);
  const inTransit = orders.filter((o): o is Order & { status: OrderStatus } => o.status === "shipped" || o.status === "processing").length;
  return { totalOrders: orders.length, inTransit, totalSpent };
}

