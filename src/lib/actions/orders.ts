"use server";

import { randomUUID } from "node:crypto";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { CartLine, PaymentMethod } from "@/lib/types";

export type CreateOrderInput = {
  lines: CartLine[];
  subtotal: number;
  shippingFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  phoneNumber?: string;
};

export type CreateOrderResult = { orderId: string; persisted: boolean };

/**
 * Persists a real order when Supabase is configured and the shopper is
 * signed in; otherwise returns a locally-generated order id so the checkout
 * flow (M-Pesa STK push simulation) still completes end-to-end for guests
 * and in demo mode. See README "Connecting Supabase" for going live.
 */
export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  if (!isSupabaseConfigured()) {
    return { orderId: randomUUID(), persisted: false };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { orderId: randomUUID(), persisted: false };
  }

  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      status: "pending",
      subtotal: input.subtotal,
      shipping_fee: input.shippingFee,
      total: input.total,
      payment_method: input.paymentMethod,
      phone_number: input.phoneNumber,
    })
    .select("id")
    .single();

  if (error || !order) {
    return { orderId: randomUUID(), persisted: false };
  }

  const items = input.lines.map((line) => ({
    order_id: order.id,
    product_id: line.productId,
    product_name: line.name,
    unit_price: line.price,
    quantity: line.quantity,
  }));
  await supabase.from("order_items").insert(items);

  return { orderId: order.id as string, persisted: true };
}
