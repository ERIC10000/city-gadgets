"use client";

import { useMemo, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { whatsappLink } from "@/lib/contact";
import { trackWhatsApp } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const DEVICE_TYPES = [
  { value: "Smartphone", icon: "smartphone" },
  { value: "Laptop / MacBook", icon: "laptop_mac" },
  { value: "Tablet / iPad", icon: "tablet_mac" },
  { value: "Smartwatch", icon: "watch" },
  { value: "Gaming Console", icon: "sports_esports" },
  { value: "Camera / Drone", icon: "photo_camera" },
  { value: "Audio", icon: "headphones" },
  { value: "Other", icon: "devices_other" },
] as const;

/**
 * `bars` is a *relative* value indicator, not a price. We never quote a figure
 * here — valuations are made by a human on WhatsApp, and printing a number the
 * shop hasn't agreed to would be a promise the business has to honour.
 */
const CONDITIONS = [
  { value: "Like New", desc: "No scratches, works perfectly, has box", bars: 4 },
  { value: "Good", desc: "Light wear, fully functional", bars: 3 },
  { value: "Fair", desc: "Visible scratches or dents, works fine", bars: 2 },
  { value: "Faulty", desc: "Cracked screen, battery or other issues", bars: 1 },
] as const;

/** Placeholder hints that follow the chosen device type. */
const HINTS: Record<string, { brand: string; model: string; specs: string }> = {
  Smartphone: { brand: "Apple", model: "iPhone 15 Pro", specs: "256GB, dual SIM" },
  "Laptop / MacBook": { brand: "Apple", model: "MacBook Air M2", specs: "512GB, 16GB RAM" },
  "Tablet / iPad": { brand: "Samsung", model: "Galaxy Tab S9", specs: "128GB, WiFi + Cellular" },
  Smartwatch: { brand: "Apple", model: "Watch Series 9", specs: "45mm, GPS" },
  "Gaming Console": { brand: "Sony", model: "PS5 Slim", specs: "1TB, 2 controllers" },
  "Camera / Drone": { brand: "Canon", model: "EOS R50", specs: "With 18-45mm lens" },
  Audio: { brand: "Sony", model: "WH-1000XM5", specs: "With case and cable" },
  Other: { brand: "Brand name", model: "Model name", specs: "Key specs" },
};

type FieldErrors = { brand?: string; model?: string };

export function SellDeviceForm() {
  const [deviceType, setDeviceType] = useState<string>(DEVICE_TYPES[0].value);
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [storage, setStorage] = useState("");
  const [condition, setCondition] = useState<string>(CONDITIONS[1].value);
  const [price, setPrice] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});

  const brandRef = useRef<HTMLInputElement>(null);
  const modelRef = useRef<HTMLInputElement>(null);

  const hint = HINTS[deviceType] ?? HINTS.Other;
  const activeCondition = CONDITIONS.find((c) => c.value === condition) ?? CONDITIONS[1];

  // Everything the shop needs to give an accurate valuation first time.
  const completeness = useMemo(() => {
    const filled = [brand.trim(), model.trim(), storage.trim(), price.trim(), name.trim()].filter(
      Boolean,
    ).length;
    return Math.round((filled / 5) * 100);
  }, [brand, model, storage, price, name]);

  const prettyPrice = price ? Number(price).toLocaleString("en-KE") : "";

  function buildMessage() {
    return [
      "Hi City Gadgets! I'd like to sell my device:",
      "",
      `• Device: ${deviceType}`,
      `• Brand & Model: ${brand} ${model}`,
      storage && `• Storage/Specs: ${storage}`,
      `• Condition: ${condition}`,
      price && `• Asking Price: KSh ${prettyPrice}`,
      name && `• Name: ${name}`,
      "",
      "Please send me a quote.",
    ]
      .filter(Boolean)
      .join("\n");
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();

    const next: FieldErrors = {};
    if (!brand.trim()) next.brand = "Tell us the brand so we can value it.";
    if (!model.trim()) next.model = "The model decides most of the price.";
    setErrors(next);

    // Send focus to the first problem rather than leaving the user hunting.
    if (next.brand) return brandRef.current?.focus();
    if (next.model) return modelRef.current?.focus();

    trackWhatsApp("sell", { device: deviceType });
    window.open(whatsappLink(buildMessage()), "_blank", "noopener,noreferrer");
  }

  const inputClass =
    "w-full rounded-xl border bg-white px-4 py-3 text-body-sm transition-colors placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-on-surface/15";

  return (
    <form
      onSubmit={submit}
      noValidate
      className="relative rounded-3xl border border-outline-variant bg-white p-6 md:p-8"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-on-surface">Get your instant quote</h2>
          <p className="mt-1 text-body-sm text-on-surface-variant">
            Takes about a minute. No account needed.
          </p>
        </div>
        <span className="hidden shrink-0 items-center gap-1.5 rounded-full bg-whatsapp-green/10 px-3 py-1.5 text-badge-text font-bold text-whatsapp-green sm:flex">
          <WhatsAppIcon className="h-3.5 w-3.5" />
          Replies in minutes
        </span>
      </div>

      {/* Completeness — the more they fill, the more accurate the quote */}
      <div className="mt-5 flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-container-high">
          <div
            className="h-full rounded-full bg-whatsapp-green transition-[width] duration-500"
            style={{ width: `${Math.max(completeness, 4)}%` }}
          />
        </div>
        <span className="shrink-0 text-badge-text font-semibold text-on-surface-variant tabular-nums">
          {completeness}% complete
        </span>
      </div>

      <div className="mt-7 space-y-6">
        {/* ---- device type ---- */}
        <fieldset>
          <legend className="mb-3 block text-body-sm font-semibold text-on-surface">
            What are you selling?
          </legend>
          <div role="radiogroup" aria-label="Device type" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {DEVICE_TYPES.map((t) => {
              const on = deviceType === t.value;
              return (
                <button
                  key={t.value}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setDeviceType(t.value)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-2xl border p-3 text-center transition-all",
                    on
                      ? "border-on-surface bg-on-surface text-white shadow-card"
                      : "border-outline-variant text-on-surface hover:border-on-surface/50 hover:bg-surface-container-high",
                  )}
                >
                  <Icon
                    name={t.icon}
                    filled={on}
                    className={cn("text-[22px]", on ? "text-white" : "text-on-surface-variant")}
                  />
                  <span className="text-badge-text font-semibold leading-tight">{t.value}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* ---- identity ---- */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="sell-brand" className="mb-1.5 block text-body-sm font-semibold text-on-surface">
              Brand <span className="text-error">*</span>
            </label>
            <input
              id="sell-brand"
              ref={brandRef}
              value={brand}
              onChange={(e) => {
                setBrand(e.target.value);
                if (errors.brand) setErrors((p) => ({ ...p, brand: undefined }));
              }}
              placeholder={`e.g. ${hint.brand}`}
              aria-invalid={Boolean(errors.brand)}
              aria-describedby={errors.brand ? "sell-brand-err" : undefined}
              className={cn(inputClass, errors.brand ? "border-error" : "border-outline-variant focus:border-on-surface")}
            />
            {errors.brand && (
              <p id="sell-brand-err" className="mt-1.5 text-badge-text font-semibold text-error">
                {errors.brand}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="sell-model" className="mb-1.5 block text-body-sm font-semibold text-on-surface">
              Model <span className="text-error">*</span>
            </label>
            <input
              id="sell-model"
              ref={modelRef}
              value={model}
              onChange={(e) => {
                setModel(e.target.value);
                if (errors.model) setErrors((p) => ({ ...p, model: undefined }));
              }}
              placeholder={`e.g. ${hint.model}`}
              aria-invalid={Boolean(errors.model)}
              aria-describedby={errors.model ? "sell-model-err" : undefined}
              className={cn(inputClass, errors.model ? "border-error" : "border-outline-variant focus:border-on-surface")}
            />
            {errors.model && (
              <p id="sell-model-err" className="mt-1.5 text-badge-text font-semibold text-error">
                {errors.model}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="sell-storage" className="mb-1.5 block text-body-sm font-semibold text-on-surface">
              Storage / key specs
            </label>
            <input
              id="sell-storage"
              value={storage}
              onChange={(e) => setStorage(e.target.value)}
              placeholder={`e.g. ${hint.specs}`}
              className={cn(inputClass, "border-outline-variant focus:border-on-surface")}
            />
          </div>

          <div>
            <label htmlFor="sell-price" className="mb-1.5 block text-body-sm font-semibold text-on-surface">
              Asking price <span className="font-normal text-on-surface-variant">(optional)</span>
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-body-sm font-semibold text-on-surface-variant">
                KSh
              </span>
              <input
                id="sell-price"
                value={prettyPrice}
                onChange={(e) => setPrice(e.target.value.replace(/[^\d]/g, ""))}
                inputMode="numeric"
                placeholder="65,000"
                className={cn(inputClass, "border-outline-variant pl-14 tabular-nums focus:border-on-surface")}
              />
            </div>
          </div>
        </div>

        {/* ---- condition ---- */}
        <fieldset>
          <legend className="mb-3 block text-body-sm font-semibold text-on-surface">Condition</legend>
          <div role="radiogroup" aria-label="Device condition" className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {CONDITIONS.map((c) => {
              const on = condition === c.value;
              return (
                <button
                  key={c.value}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setCondition(c.value)}
                  className={cn(
                    "rounded-xl border p-3.5 text-left transition-all",
                    on
                      ? "border-on-surface bg-surface-container-high ring-1 ring-on-surface"
                      : "border-outline-variant hover:border-on-surface/40 hover:bg-surface-container-high/50",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-body-sm font-bold text-on-surface">{c.value}</p>
                    {/* Relative value indicator — deliberately not a price */}
                    <span className="flex shrink-0 gap-0.5" aria-hidden="true">
                      {[1, 2, 3, 4].map((b) => (
                        <span
                          key={b}
                          className={cn(
                            "h-3.5 w-1 rounded-full",
                            b <= c.bars ? "bg-whatsapp-green" : "bg-outline-variant",
                          )}
                        />
                      ))}
                    </span>
                  </div>
                  <p className="mt-0.5 text-badge-text text-on-surface-variant">{c.desc}</p>
                </button>
              );
            })}
          </div>
          <p className="mt-2.5 flex items-start gap-1.5 text-badge-text text-on-surface-variant">
            <Icon name="info" className="mt-px text-[14px]" />
            Bars show relative value only. Your actual offer is confirmed after we inspect the device.
          </p>
        </fieldset>

        <div>
          <label htmlFor="sell-name" className="mb-1.5 block text-body-sm font-semibold text-on-surface">
            Your name <span className="font-normal text-on-surface-variant">(optional)</span>
          </label>
          <input
            id="sell-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="So we know who to address"
            className={cn(inputClass, "border-outline-variant focus:border-on-surface")}
          />
        </div>

        {/* ---- live summary — no surprises about what gets sent ---- */}
        <div className="rounded-2xl border border-dashed border-outline-variant bg-surface-container-high/50 p-4">
          <p className="flex items-center gap-1.5 text-badge-text font-bold uppercase tracking-wide text-on-surface-variant">
            <Icon name="visibility" className="text-[15px]" />
            What we&apos;ll receive
          </p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            <span className="rounded-full bg-white px-2.5 py-1 text-badge-text font-semibold text-on-surface ring-1 ring-outline-variant">
              {deviceType}
            </span>
            <span className="rounded-full bg-white px-2.5 py-1 text-badge-text font-semibold text-on-surface ring-1 ring-outline-variant">
              {brand.trim() || model.trim() ? `${brand} ${model}`.trim() : "Brand & model pending"}
            </span>
            {storage.trim() && (
              <span className="rounded-full bg-white px-2.5 py-1 text-badge-text font-semibold text-on-surface ring-1 ring-outline-variant">
                {storage}
              </span>
            )}
            <span className="rounded-full bg-white px-2.5 py-1 text-badge-text font-semibold text-on-surface ring-1 ring-outline-variant">
              {activeCondition.value}
            </span>
            {price && (
              <span className="rounded-full bg-white px-2.5 py-1 text-badge-text font-semibold text-on-surface ring-1 ring-outline-variant tabular-nums">
                KSh {prettyPrice}
              </span>
            )}
          </div>
        </div>

        {(errors.brand || errors.model) && (
          <p role="alert" className="flex items-center gap-2 rounded-xl bg-error/10 px-4 py-3 text-body-sm font-semibold text-error">
            <Icon name="error" className="text-[18px]" />
            Add the missing details above so we can value your device.
          </p>
        )}

        <div>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-whatsapp-green px-6 py-4 font-bold text-white transition-transform hover:scale-[1.01] active:scale-[0.99]"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Get My Quote on WhatsApp
          </button>
          <p className="mt-2.5 flex items-center justify-center gap-1.5 text-center text-badge-text text-on-surface-variant">
            <Icon name="lock" className="text-[14px]" />
            Opens WhatsApp with your details pre-filled. Nothing is stored on our site.
          </p>
        </div>
      </div>
    </form>
  );
}
