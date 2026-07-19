"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { formatKES, slugifyPhone } from "@/lib/format";
import { WHATSAPP_PRIMARY } from "@/lib/contact";
import { useCartStore } from "@/store/cart";
import { createOrder } from "@/lib/actions/orders";
import { cn } from "@/lib/utils";
import type { PaymentMethod } from "@/lib/types";

const SHIPPING_FEE = 500;

type Status = "idle" | "processing" | "error";

export function CheckoutView() {
  const router = useRouter();
  const lines = useCartStore((s) => s.lines);
  const subtotal = useCartStore((s) => s.subtotal());
  const clear = useCartStore((s) => s.clear);

  const [method, setMethod] = useState<PaymentMethod>("mpesa");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [promoDraft, setPromoDraft] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState(false);
  const [instructions, setInstructions] = useState("");

  // Demo welcome code — replace with a codes table once real promos launch.
  const PROMO_CODE = "KARIBU10";
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal - discount + (lines.length ? SHIPPING_FEE : 0);

  function applyPromo() {
    const ok = promoDraft.trim().toUpperCase() === PROMO_CODE;
    setPromoApplied(ok);
    setPromoError(!ok);
    if (ok) setPromoDraft("");
  }

  async function handleSubmit() {
    if (lines.length === 0 || status === "processing") return;
    if (method === "mpesa" && phone.replace(/\D/g, "").length < 9) {
      setStatus("error");
      return;
    }

    setStatus("processing");
    // Simulated Safaricom Daraja STK push round-trip — see README for wiring
    // up the real API once merchant credentials are available.
    await new Promise((resolve) => setTimeout(resolve, method === "mpesa" ? 2200 : 600));

    const result = await createOrder({
      lines,
      subtotal,
      shippingFee: SHIPPING_FEE,
      total,
      paymentMethod: method,
      phoneNumber: method === "mpesa" ? `254${phone.replace(/\D/g, "")}` : undefined,
    });

    if (method === "whatsapp") {
      const itemList = lines.map((l) => `• ${l.name} x${l.quantity}`).join("%0A");
      const extras = [
        promoApplied ? `Promo: ${PROMO_CODE} (−${formatKES(discount)})` : "",
        instructions.trim() ? `Delivery notes: ${instructions.trim()}` : "",
      ]
        .filter(Boolean)
        .map((s) => `%0A${encodeURIComponent(s)}`)
        .join("");
      const text = `Hi! I'd like to complete my order (Ref: ${result.orderId.slice(0, 8).toUpperCase()}):%0A${itemList}%0A%0ATotal: ${formatKES(total)}${extras}`;
      window.open(`https://wa.me/${WHATSAPP_PRIMARY}?text=${text}`, "_blank");
    }

    clear();
    router.push(`/checkout/success?order=${result.orderId}`);
  }

  if (lines.length === 0) {
    return (
      <div className="rounded-2xl bg-surface-container-low py-24 text-center">
        <p className="font-bold text-on-surface">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Progress stepper */}
      <div className="mb-8 flex items-center justify-center gap-3">
        {[
          { label: "Cart", state: "done" },
          { label: "Payment", state: "active" },
          { label: "Confirmation", state: "todo" },
        ].map((s, i) => (
          <div key={s.label} className="flex items-center gap-3">
            {i > 0 && <span className={cn("h-px w-8 md:w-16", s.state === "todo" ? "bg-outline-variant" : "bg-on-surface")} />}
            <span className="flex items-center gap-2">
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-badge-text font-bold",
                  s.state === "done" && "bg-secondary text-white",
                  s.state === "active" && "bg-on-surface text-white",
                  s.state === "todo" && "border border-outline-variant text-on-surface-variant",
                )}
              >
                {s.state === "done" ? <Icon name="check" className="text-[14px]" /> : i + 1}
              </span>
              <span
                className={cn(
                  "text-body-sm",
                  s.state === "active" ? "font-bold text-on-surface" : "font-medium text-on-surface-variant",
                )}
              >
                {s.label}
              </span>
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
      <div className="space-y-6 rounded-2xl bg-surface-off-white p-6 md:justify-self-end md:p-8">
        <h2 className="font-bold text-on-surface">Order Summary</h2>
        <div className="space-y-4">
          {lines.map((line) => (
            <div key={line.productId} className="flex items-center gap-3">
              <div className="relative h-14 w-14 flex-none overflow-hidden rounded-lg bg-white">
                {line.image ? <Image src={line.image} alt={line.name} fill sizes="56px" className="object-contain p-1.5" /> : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-body-sm font-bold text-on-surface">{line.name}</p>
                <p className="text-body-sm text-on-surface-variant">Qty {line.quantity}</p>
              </div>
              <p className="text-body-sm font-bold text-on-surface">{formatKES(line.price * line.quantity)}</p>
            </div>
          ))}
        </div>
        {/* Promo code */}
        <div className="border-t border-outline-variant/60 pt-4">
          <p className="mb-2 text-body-sm font-semibold text-on-surface">Have a promo code?</p>
          {promoApplied ? (
            <div className="flex items-center justify-between rounded-full border border-secondary bg-secondary-container/40 px-4 py-2">
              <span className="flex items-center gap-1.5 text-body-sm font-bold text-on-secondary-container">
                <Icon name="check_circle" className="text-[16px]" />
                {PROMO_CODE} applied
              </span>
              <button
                type="button"
                onClick={() => setPromoApplied(false)}
                className="text-body-sm font-semibold text-on-surface-variant hover:text-error"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                value={promoDraft}
                onChange={(e) => {
                  setPromoDraft(e.target.value);
                  setPromoError(false);
                }}
                placeholder="Enter coupon code"
                className={cn(
                  "min-w-0 flex-1 rounded-full border px-4 py-2 text-body-sm focus:outline-none",
                  promoError ? "border-error" : "border-outline-variant focus:border-on-surface",
                )}
              />
              <button
                type="button"
                onClick={applyPromo}
                className="shrink-0 rounded-full bg-on-surface px-5 py-2 text-body-sm font-bold text-white hover:opacity-90"
              >
                Apply
              </button>
            </div>
          )}
          {promoError && <p className="mt-1.5 text-badge-text font-semibold text-error">That code isn&apos;t valid.</p>}
        </div>

        <div className="space-y-2 border-t border-outline-variant/60 pt-4 text-body-sm text-on-surface-variant">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatKES(subtotal)}</span>
          </div>
          {promoApplied && (
            <div className="flex justify-between font-semibold text-secondary">
              <span>Discount ({PROMO_CODE})</span>
              <span>−{formatKES(discount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{formatKES(SHIPPING_FEE)}</span>
          </div>
        </div>
        <div className="flex justify-between border-t-2 border-primary/10 pt-4 text-lg font-extrabold text-on-surface">
          <span>Total</span>
          <span>{formatKES(total)}</span>
        </div>
        <div className="flex flex-wrap gap-3 pt-2">
          <span className="flex items-center gap-1 rounded-full bg-surface-container-highest px-3 py-1 text-body-sm text-on-surface-variant">
            <Icon name="verified_user" className="text-[16px]" />
            Authentic Product
          </span>
          <span className="flex items-center gap-1 rounded-full bg-surface-container-highest px-3 py-1 text-body-sm text-on-surface-variant">
            <Icon name="security" className="text-[16px]" />
            SSL Secured
          </span>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="font-bold text-on-surface">Payment Method</h2>
          <p className="text-body-sm text-on-surface-variant">Choose how you&apos;d like to pay.</p>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setMethod("mpesa")}
            className={cn(
              "w-full rounded-xl border-2 p-4 text-left transition-all",
              method === "mpesa" ? "border-primary bg-primary/5" : "border-outline-variant",
            )}
          >
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "flex h-5 w-5 flex-none items-center justify-center rounded-full border-2",
                  method === "mpesa" ? "border-primary" : "border-outline-variant",
                )}
              >
                {method === "mpesa" && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
              </span>
              <Icon name="payments" className="text-m-pesa-green" />
              <span className="font-bold text-on-surface">M-Pesa STK Push</span>
            </div>
            {method === "mpesa" && (
              <div className="mt-4 pl-8">
                <label className="mb-1 block text-body-sm font-semibold text-on-surface-variant">Phone Number</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-body-sm text-on-surface-variant">+254</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(slugifyPhone(e.target.value))}
                    placeholder="712 345 678"
                    className="w-full rounded-lg border border-outline-variant py-3 pl-16 pr-4 focus:border-primary focus:outline-none"
                  />
                </div>
                <p className="mt-1 text-body-sm text-on-surface-variant">You&apos;ll receive a prompt on your phone to enter your PIN.</p>
              </div>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMethod("whatsapp")}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl border-2 p-4 text-left transition-all",
              method === "whatsapp" ? "border-primary bg-primary/5" : "border-outline-variant",
            )}
          >
            <span
              className={cn(
                "flex h-5 w-5 flex-none items-center justify-center rounded-full border-2",
                method === "whatsapp" ? "border-primary" : "border-outline-variant",
              )}
            >
              {method === "whatsapp" && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
            </span>
            <WhatsAppIcon className="h-5 w-5 text-whatsapp-green" />
            <span className="flex-1 font-bold text-on-surface">Order via WhatsApp</span>
            <Icon name="chevron_right" className="text-on-surface-variant" />
          </button>

          <button
            type="button"
            onClick={() => setMethod("card")}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl border-2 p-4 text-left transition-all",
              method === "card" ? "border-primary bg-primary/5" : "border-outline-variant",
            )}
          >
            <span
              className={cn(
                "flex h-5 w-5 flex-none items-center justify-center rounded-full border-2",
                method === "card" ? "border-primary" : "border-outline-variant",
              )}
            >
              {method === "card" && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
            </span>
            <Icon name="credit_card" className="text-on-surface-variant" />
            <span className="flex-1 font-bold text-on-surface">Card</span>
            <span className="rounded-full bg-surface-container-highest px-2 py-0.5 text-badge-text text-on-surface-variant">
              Coming Soon
            </span>
          </button>
        </div>

        {/* Delivery instructions */}
        <div>
          <h2 className="font-bold text-on-surface">Delivery Instructions</h2>
          <p className="mb-3 text-body-sm text-on-surface-variant">Help our rider find you — optional.</p>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows={3}
            placeholder="e.g. Gate code is 4471, call when 15 minutes out — 3rd floor, no lift."
            className="w-full rounded-xl border border-outline-variant px-4 py-3 text-body-sm focus:border-on-surface focus:outline-none"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {["Leave at reception", "Call on arrival", "Gated community", "Deliver after 5pm"].map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => setInstructions((v) => (v.includes(chip) ? v : v ? `${v} · ${chip}` : chip))}
                className="rounded-full border border-outline-variant px-3 py-1.5 text-badge-text font-semibold text-on-surface-variant transition-colors hover:border-on-surface hover:text-on-surface"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {status === "error" && (
          <p className="text-body-sm font-semibold text-error">Enter a valid M-Pesa phone number to continue.</p>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={status === "processing" || method === "card"}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-bold text-on-primary transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "processing" ? (
            <>
              <Icon name="progress_activity" className="animate-spin" />
              {method === "mpesa" ? "Sending STK push…" : "Processing…"}
            </>
          ) : (
            <>
              <Icon name="lock_open" />
              Complete Order
            </>
          )}
        </button>
        <p className="text-center text-body-sm text-on-surface-variant">
          By completing your order you agree to our Terms of Service and Return Policy.
        </p>
      </div>
      </div>
    </div>
  );
}
