// Lightweight GA4 event helpers. gtag is loaded in the root layout; these are
// no-ops until it's ready and never throw, so they're safe to call anywhere.
// Mark whatsapp_click / begin_checkout / add_to_cart as "key events" in GA4 and
// import them into Google Ads to make ad spend measurable.

type Params = Record<string, unknown>;

export function trackEvent(name: string, params: Params = {}): void {
  if (typeof window === "undefined") return;
  const w = window as unknown as { gtag?: (command: string, event: string, params?: Params) => void };
  try {
    w.gtag?.("event", name, params);
  } catch {
    /* analytics is best-effort */
  }
}

/** WhatsApp order/enquiry click — the store's primary conversion. */
export function trackWhatsApp(source: string, params: Params = {}): void {
  trackEvent("whatsapp_click", { source, ...params });
}

export function trackAddToCart(item: { id: string; name: string; price: number; quantity?: number }): void {
  const quantity = item.quantity ?? 1;
  trackEvent("add_to_cart", {
    currency: "KES",
    value: item.price * quantity,
    items: [{ item_id: item.id, item_name: item.name, price: item.price, quantity }],
  });
}

export function trackBeginCheckout(value: number, itemCount: number): void {
  trackEvent("begin_checkout", { currency: "KES", value, items: itemCount });
}
