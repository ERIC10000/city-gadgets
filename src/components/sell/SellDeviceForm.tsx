"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { whatsappLink } from "@/lib/contact";
import { cn } from "@/lib/utils";

const DEVICE_TYPES = ["Smartphone", "Laptop / MacBook", "Tablet / iPad", "Smartwatch", "Gaming Console", "Camera / Drone", "Audio", "Other"];
const CONDITIONS = [
  { value: "Like New", desc: "No scratches, works perfectly, has box" },
  { value: "Good", desc: "Light wear, fully functional" },
  { value: "Fair", desc: "Visible scratches or dents, works fine" },
  { value: "Faulty", desc: "Cracked screen, battery or other issues" },
];

export function SellDeviceForm() {
  const [deviceType, setDeviceType] = useState(DEVICE_TYPES[0]);
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [storage, setStorage] = useState("");
  const [condition, setCondition] = useState(CONDITIONS[1].value);
  const [price, setPrice] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!brand.trim() || !model.trim()) {
      setError("Please fill in the brand and model so we can value your device.");
      return;
    }
    setError(null);
    const message = [
      "Hi City Gadgets! I'd like to sell my device:",
      "",
      `• Device: ${deviceType}`,
      `• Brand & Model: ${brand} ${model}`,
      storage && `• Storage/Specs: ${storage}`,
      `• Condition: ${condition}`,
      price && `• Asking Price: KSh ${price}`,
      name && `• Name: ${name}`,
      "",
      "Please send me a quote.",
    ]
      .filter(Boolean)
      .join("\n");
    window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
  }

  const inputClass =
    "w-full rounded-xl border border-outline-variant bg-white px-4 py-3 text-body-sm focus:border-on-surface focus:outline-none";

  return (
    <form onSubmit={submit} className="space-y-5 rounded-3xl border border-outline-variant bg-white p-6 md:p-8">
      <h2 className="text-lg font-extrabold text-on-surface">Get your instant quote</h2>

      <div>
        <label className="mb-2 block text-body-sm font-semibold text-on-surface">What are you selling?</label>
        <div className="flex flex-wrap gap-2">
          {DEVICE_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setDeviceType(t)}
              className={cn(
                "rounded-full border px-4 py-2 text-body-sm font-semibold transition-colors",
                deviceType === t
                  ? "border-on-surface bg-on-surface text-white"
                  : "border-outline-variant text-on-surface hover:border-on-surface",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-body-sm font-semibold text-on-surface">Brand *</label>
          <input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="e.g. Apple" className={inputClass} />
        </div>
        <div>
          <label className="mb-1 block text-body-sm font-semibold text-on-surface">Model *</label>
          <input value={model} onChange={(e) => setModel(e.target.value)} placeholder="e.g. iPhone 15 Pro" className={inputClass} />
        </div>
        <div>
          <label className="mb-1 block text-body-sm font-semibold text-on-surface">Storage / key specs</label>
          <input value={storage} onChange={(e) => setStorage(e.target.value)} placeholder="e.g. 256GB, 8GB RAM" className={inputClass} />
        </div>
        <div>
          <label className="mb-1 block text-body-sm font-semibold text-on-surface">Asking price (KSh, optional)</label>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value.replace(/[^\d]/g, ""))}
            inputMode="numeric"
            placeholder="e.g. 65000"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-body-sm font-semibold text-on-surface">Condition</label>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {CONDITIONS.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setCondition(c.value)}
              className={cn(
                "rounded-xl border p-3 text-left transition-colors",
                condition === c.value ? "border-on-surface bg-surface-container-high" : "border-outline-variant hover:border-on-surface/40",
              )}
            >
              <p className="text-body-sm font-bold text-on-surface">{c.value}</p>
              <p className="text-badge-text text-on-surface-variant">{c.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-body-sm font-semibold text-on-surface">Your name (optional)</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="So we know who to address" className={inputClass} />
      </div>

      {error && <p className="text-body-sm font-semibold text-error">{error}</p>}

      <button
        type="submit"
        className="flex h-13 w-full items-center justify-center gap-2 rounded-full bg-whatsapp-green px-6 py-3.5 font-bold text-white transition-transform hover:scale-[1.01]"
      >
        <WhatsAppIcon className="h-5 w-5" />
        Get My Quote on WhatsApp
      </button>
      <p className="flex items-center justify-center gap-1.5 text-center text-badge-text text-on-surface-variant">
        <Icon name="lock" className="text-[14px]" />
        No account needed — opens WhatsApp with your details pre-filled.
      </p>
    </form>
  );
}
