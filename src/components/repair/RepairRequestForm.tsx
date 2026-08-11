"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { STORE_ADDRESS, WHATSAPP_NUMBERS, whatsappLink } from "@/lib/contact";
import { cn } from "@/lib/utils";

// Repairs go to Customer Relations (warranty & support), not the sales line.
const REPAIR_NUMBER = WHATSAPP_NUMBERS[1].raw;

const DEVICES = [
  { value: "Phone", icon: "smartphone" },
  { value: "Laptop / MacBook", icon: "laptop_mac" },
  { value: "Gaming Console", icon: "sports_esports" },
  { value: "Gaming Pad / Controller", icon: "stadia_controller" },
  { value: "Tablet / iPad", icon: "tablet_mac" },
  { value: "Smartwatch", icon: "watch" },
  { value: "TV / Monitor Screen", icon: "tv" },
  { value: "Audio Device", icon: "headphones" },
  { value: "Other", icon: "devices_other" },
] as const;

const FAULTS = [
  "Cracked / broken screen",
  "Won't power on",
  "Battery drains fast",
  "Won't charge / charging port",
  "Water / liquid damage",
  "Overheating",
  "Software / OS problem",
  "Speaker / microphone",
  "Camera fault",
  "Buttons / controls",
  "Wi-Fi / Bluetooth",
  "Slow performance",
  "Other issue",
] as const;

const SERVICES = [
  {
    value: "pickup",
    title: "Send a rider to pick it up",
    desc: "Free within Nairobi — we collect, repair and return it to you.",
    icon: "two_wheeler",
  },
  {
    value: "dropoff",
    title: "I'll drop it at your shop",
    desc: STORE_ADDRESS.full,
    icon: "storefront",
  },
] as const;

type Errors = { faults?: string; service?: string; location?: string; phone?: string };

export function RepairRequestForm() {
  const [device, setDevice] = useState<string>(DEVICES[0].value);
  const [faults, setFaults] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [brandModel, setBrandModel] = useState("");
  const [service, setService] = useState<"" | "pickup" | "dropoff">("");
  const [location, setLocation] = useState("");
  const [when, setWhen] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  const faultsRef = useRef<HTMLFieldSetElement>(null);
  const serviceRef = useRef<HTMLFieldSetElement>(null);
  const locationRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  function toggleFault(f: string) {
    setFaults((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));
    if (errors.faults) setErrors((p) => ({ ...p, faults: undefined }));
  }

  function buildMessage() {
    const serviceLine =
      service === "pickup"
        ? `• Collection: Rider pickup${location.trim() ? ` from ${location.trim()}` : ""}`
        : "• Collection: Drop-off at your shop";
    return [
      "Hi City Gadgets! I'd like to request a repair.",
      "",
      `• Device: ${device}`,
      faults.length ? `• Issue: ${faults.join(", ")}` : null,
      description.trim() ? `• Details: ${description.trim()}` : null,
      brandModel.trim() ? `• Brand & model: ${brandModel.trim()}` : null,
      serviceLine,
      service === "pickup" && when.trim() ? `• Preferred time: ${when.trim()}` : null,
      name.trim() ? `• Name: ${name.trim()}` : null,
      `• Phone: ${phone.trim()}`,
      "",
      "Please advise on the next steps and a rough quote.",
    ]
      .filter(Boolean)
      .join("\n");
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: Errors = {};
    if (faults.length === 0 && !description.trim()) next.faults = "Pick an issue or describe the fault.";
    if (!service) next.service = "Tell us how we should collect the device.";
    if (service === "pickup" && !location.trim()) next.location = "Where should the rider collect it?";
    if (!phone.trim()) next.phone = "We need a phone number to arrange the repair.";
    setErrors(next);

    if (next.faults) return faultsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    if (next.service) return serviceRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    if (next.location) return locationRef.current?.focus();
    if (next.phone) return phoneRef.current?.focus();

    window.open(whatsappLink(buildMessage(), REPAIR_NUMBER), "_blank", "noopener,noreferrer");
  }

  const inputClass =
    "w-full rounded-xl border border-outline-variant bg-white px-4 py-3 text-body-sm transition-colors placeholder:text-on-surface-variant/60 focus:border-on-surface focus:outline-none focus:ring-2 focus:ring-on-surface/15";

  return (
    <form onSubmit={submit} noValidate className="rounded-3xl border border-outline-variant bg-white p-6 shadow-card md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-on-surface">Request a repair</h2>
          <p className="mt-1 text-body-sm text-on-surface-variant">Free diagnosis. No account needed.</p>
        </div>
        <span className="hidden shrink-0 items-center gap-1.5 rounded-full bg-whatsapp-green/10 px-3 py-1.5 text-badge-text font-bold text-whatsapp-green sm:flex">
          <WhatsAppIcon className="h-3.5 w-3.5" />
          Replies in minutes
        </span>
      </div>

      <div className="mt-7 space-y-7">
        {/* Device */}
        <fieldset>
          <legend className="mb-3 block text-body-sm font-semibold text-on-surface">What needs fixing?</legend>
          <div role="radiogroup" aria-label="Device type" className="grid grid-cols-3 gap-2 sm:grid-cols-3">
            {DEVICES.map((d) => {
              const on = device === d.value;
              return (
                <button
                  key={d.value}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setDevice(d.value)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-center transition-all",
                    on
                      ? "border-on-surface bg-on-surface text-white shadow-card"
                      : "border-outline-variant text-on-surface hover:border-on-surface/50 hover:bg-surface-container-high",
                  )}
                >
                  <Icon name={d.icon} filled={on} className={cn("text-[22px]", on ? "text-white" : "text-on-surface-variant")} />
                  <span className="text-badge-text font-semibold leading-tight">{d.value}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Faults */}
        <fieldset ref={faultsRef} aria-describedby={errors.faults ? "rp-faults-error" : undefined}>
          <legend className="mb-3 block text-body-sm font-semibold text-on-surface">
            What&apos;s the problem? <span className="font-normal text-on-surface-variant">(select all that apply)</span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {FAULTS.map((f) => {
              const on = faults.includes(f);
              return (
                <button
                  key={f}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggleFault(f)}
                  className={cn(
                    "rounded-full border px-3.5 py-2 text-badge-text font-semibold transition-all",
                    on
                      ? "border-on-surface bg-on-surface text-white"
                      : "border-outline-variant text-on-surface hover:border-on-surface/50 hover:bg-surface-container-high",
                  )}
                >
                  {on && <Icon name="check" className="mr-1 align-middle text-[14px]" />}
                  {f}
                </button>
              );
            })}
          </div>
          {errors.faults && (
            <p id="rp-faults-error" role="alert" className="mt-2 text-badge-text font-semibold text-error">
              {errors.faults}
            </p>
          )}
          <label htmlFor="rp-details" className="mb-1.5 mt-3 block text-body-sm font-semibold text-on-surface">
            Additional details <span className="font-normal text-on-surface-variant">(optional)</span>
          </label>
          <textarea
            id="rp-details"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.faults) setErrors((p) => ({ ...p, faults: undefined }));
            }}
            rows={3}
            placeholder="Describe what happened — e.g. screen cracked after a fall, still turns on."
            className={cn(inputClass, "resize-none")}
          />
        </fieldset>

        {/* Brand / model */}
        <div>
          <label htmlFor="rp-model" className="mb-1.5 block text-body-sm font-semibold text-on-surface">
            Brand &amp; model <span className="font-normal text-on-surface-variant">(optional, helps us prepare)</span>
          </label>
          <input
            id="rp-model"
            value={brandModel}
            onChange={(e) => setBrandModel(e.target.value)}
            placeholder="e.g. iPhone 13 Pro, PS5, HP Pavilion"
            className={inputClass}
          />
        </div>

        {/* Service */}
        <fieldset ref={serviceRef} aria-describedby={errors.service ? "rp-service-error" : undefined}>
          <legend className="mb-3 block text-body-sm font-semibold text-on-surface">How should we collect it?</legend>
          <div role="radiogroup" aria-label="Collection method" className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {SERVICES.map((s) => {
              const on = service === s.value;
              return (
                <button
                  key={s.value}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => {
                    setService(s.value);
                    setErrors((p) => ({ ...p, service: undefined }));
                  }}
                  className={cn(
                    "flex items-start gap-3 rounded-2xl border p-4 text-left transition-all",
                    on
                      ? "border-on-surface bg-surface-container-high ring-1 ring-on-surface"
                      : "border-outline-variant hover:border-on-surface/40 hover:bg-surface-container-high/50",
                  )}
                >
                  <Icon name={s.icon} filled={on} className={cn("shrink-0 text-[22px]", on ? "text-on-surface" : "text-on-surface-variant")} />
                  <span>
                    <span className="block text-body-sm font-bold text-on-surface">{s.title}</span>
                    <span className="mt-0.5 block text-badge-text text-on-surface-variant">{s.desc}</span>
                  </span>
                </button>
              );
            })}
          </div>
          {errors.service && (
            <p id="rp-service-error" role="alert" className="mt-2 text-badge-text font-semibold text-error">
              {errors.service}
            </p>
          )}

          {service === "pickup" && (
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="rp-loc" className="mb-1.5 block text-body-sm font-semibold text-on-surface">
                  Pickup location <span className="text-error">*</span>
                </label>
                <input
                  id="rp-loc"
                  ref={locationRef}
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    if (errors.location) setErrors((p) => ({ ...p, location: undefined }));
                  }}
                  placeholder="Area / estate + landmark"
                  aria-invalid={Boolean(errors.location)}
                  aria-describedby={errors.location ? "rp-location-error" : undefined}
                  className={cn(inputClass, errors.location && "border-error")}
                />
                {errors.location && (
                  <p id="rp-location-error" role="alert" className="mt-1.5 text-badge-text font-semibold text-error">
                    {errors.location}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="rp-when" className="mb-1.5 block text-body-sm font-semibold text-on-surface">
                  Preferred time <span className="font-normal text-on-surface-variant">(optional)</span>
                </label>
                <input
                  id="rp-when"
                  value={when}
                  onChange={(e) => setWhen(e.target.value)}
                  placeholder="e.g. Today after 2pm"
                  className={inputClass}
                />
              </div>
            </div>
          )}
        </fieldset>

        {/* Contact */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="rp-name" className="mb-1.5 block text-body-sm font-semibold text-on-surface">
              Your name <span className="font-normal text-on-surface-variant">(optional)</span>
            </label>
            <input id="rp-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Who should we address?" className={inputClass} />
          </div>
          <div>
            <label htmlFor="rp-phone" className="mb-1.5 block text-body-sm font-semibold text-on-surface">
              Phone <span className="text-error">*</span>
            </label>
            <input
              id="rp-phone"
              ref={phoneRef}
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (errors.phone) setErrors((p) => ({ ...p, phone: undefined }));
              }}
              type="tel"
              inputMode="tel"
              placeholder="07xx xxx xxx"
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? "rp-phone-error" : undefined}
              className={cn(inputClass, errors.phone && "border-error")}
            />
            {errors.phone && (
              <p id="rp-phone-error" role="alert" className="mt-1.5 text-badge-text font-semibold text-error">
                {errors.phone}
              </p>
            )}
          </div>
        </div>

        {/* Live summary */}
        <div className="rounded-2xl border border-dashed border-outline-variant bg-surface-container-high/50 p-4">
          <p className="flex items-center gap-1.5 text-badge-text font-bold uppercase tracking-wide text-on-surface-variant">
            <Icon name="visibility" className="text-[15px]" />
            What we&apos;ll receive
          </p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            <span className="rounded-full bg-white px-2.5 py-1 text-badge-text font-semibold text-on-surface ring-1 ring-outline-variant">{device}</span>
            <span className="rounded-full bg-white px-2.5 py-1 text-badge-text font-semibold text-on-surface ring-1 ring-outline-variant">
              {faults.length ? `${faults.length} issue${faults.length > 1 ? "s" : ""}` : "Issue pending"}
            </span>
            {service && (
              <span className="rounded-full bg-white px-2.5 py-1 text-badge-text font-semibold text-on-surface ring-1 ring-outline-variant">
                {service === "pickup" ? "Rider pickup" : "Shop drop-off"}
              </span>
            )}
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-whatsapp-green px-6 py-4 font-bold text-white transition-transform hover:scale-[1.01] active:scale-[0.99]"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Send Repair Request on WhatsApp
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
