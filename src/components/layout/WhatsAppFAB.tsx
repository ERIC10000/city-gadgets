"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { WHATSAPP_NUMBERS, whatsappLink } from "@/lib/contact";

export function WhatsAppFAB() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-24 right-6 z-40 flex flex-col items-end gap-3 md:bottom-8 md:right-8">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="w-64 overflow-hidden rounded-2xl bg-white shadow-card-lg ring-1 ring-black/5"
          >
            <div className="bg-whatsapp-green px-4 py-3 text-white">
              <p className="text-sm font-bold">Chat with City Gadgets</p>
              <p className="text-xs text-white/80">We reply within minutes</p>
            </div>
            <div className="divide-y divide-neutral-100">
              {WHATSAPP_NUMBERS.map((n) => (
                <Link
                  key={n.raw}
                  href={whatsappLink("Hi City Gadgets! I have a question about a product.", n.raw)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-neutral-50"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-whatsapp-green/10">
                    <WhatsAppIcon className="h-5 w-5 text-whatsapp-green" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-neutral-900">{n.display}</p>
                    <p className="text-xs text-neutral-500">Tap to chat on WhatsApp</p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Chat with us on WhatsApp"
        aria-expanded={open}
        className="group flex h-14 items-center gap-2 overflow-hidden rounded-full bg-whatsapp-green px-4 text-white shadow-card-lg transition-all hover:pr-5"
      >
        <WhatsAppIcon className="h-7 w-7 shrink-0" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-bold transition-all duration-300 group-hover:max-w-[160px]">
          Chat with us
        </span>
      </button>
    </div>
  );
}
