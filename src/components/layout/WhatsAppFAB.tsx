"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { OPENING_HOURS, WHATSAPP_NUMBERS, whatsappLink } from "@/lib/contact";

/** Nairobi is UTC+3 year-round, so the offset is a constant. */
const NAIROBI_OFFSET_MINUTES = 3 * 60;

/**
 * Resolves whether the shop is currently open, using the published hours
 * rather than a hard-coded schedule. Runs client-side only, so the badge
 * never disagrees with server-rendered markup.
 */
function useIsOpenNow(): boolean | null {
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    function evaluate() {
      const now = new Date();
      const nairobi = new Date(now.getTime() + (NAIROBI_OFFSET_MINUTES + now.getTimezoneOffset()) * 60_000);
      const dayName = nairobi.toLocaleDateString("en-US", { weekday: "long" });
      const minutes = nairobi.getHours() * 60 + nairobi.getMinutes();

      const today = OPENING_HOURS.find(
        (h) => h.open && (h.schemaDays as readonly string[]).includes(dayName),
      );
      if (!today || !today.opens || !today.closes) return setOpen(false);

      const [oh, om] = today.opens.split(":").map(Number);
      const [ch, cm] = today.closes.split(":").map(Number);
      setOpen(minutes >= oh * 60 + om && minutes < ch * 60 + cm);
    }

    evaluate();
    const t = setInterval(evaluate, 60_000);
    return () => clearInterval(t);
  }, []);

  return open;
}

export function WhatsAppFAB() {
  const [open, setOpen] = useState(false);
  const [teased, setTeased] = useState(false);
  const isOpenNow = useIsOpenNow();

  // A single, unobtrusive welcome: the label slides out a few seconds after
  // landing, then retracts. It never repeats, and never fires once the panel
  // has been opened.
  useEffect(() => {
    const show = setTimeout(() => setTeased(true), 2600);
    const hide = setTimeout(() => setTeased(false), 7600);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, []);

  const labelOut = teased && !open;

  return (
    <div className="fixed bottom-24 right-6 z-40 flex flex-col items-end gap-3 md:bottom-8 md:right-8">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="w-[19rem] origin-bottom-right overflow-hidden rounded-2xl bg-white shadow-card-lg ring-1 ring-black/5"
          >
            <div className="bg-whatsapp-green px-4 py-3.5 text-white">
              <p className="text-sm font-bold">Welcome to City Gadgets</p>
              <p className="mt-0.5 text-xs text-white/85">
                Pick the right desk and we&apos;ll take it from there.
              </p>
              {isOpenNow !== null && (
                <span className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold backdrop-blur-sm">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${isOpenNow ? "bg-emerald-300" : "bg-white/50"}`}
                    aria-hidden="true"
                  />
                  {isOpenNow ? "Open now — we reply in minutes" : "Closed — leave a message, we'll reply"}
                </span>
              )}
            </div>

            <div className="divide-y divide-neutral-100">
              {WHATSAPP_NUMBERS.map((n, i) => (
                <motion.div
                  key={n.raw}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.09 + i * 0.07, duration: 0.28 }}
                >
                  <Link
                    href={whatsappLink(
                      `Hi City Gadgets! I'd like to speak to ${n.role}.`,
                      n.raw,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="group flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-neutral-50"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-whatsapp-green/10 transition-transform group-hover:scale-105">
                      <WhatsAppIcon className="h-5 w-5 text-whatsapp-green" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-neutral-900">{n.role}</p>
                      <p className="text-xs text-neutral-500">{n.blurb}</p>
                      <p className="mt-0.5 text-xs font-semibold text-whatsapp-green">{n.display}</p>
                    </div>
                    <span className="shrink-0 text-neutral-300 transition-all group-hover:translate-x-0.5 group-hover:text-whatsapp-green">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative">
        {/* Attention ping — one slow pulse behind the button while idle. */}
        {!open && (
          <motion.span
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-whatsapp-green"
            animate={{ scale: [1, 1.35], opacity: [0.45, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.6, ease: "easeOut" }}
          />
        )}

        <button
          type="button"
          onClick={() => {
            setOpen((v) => !v);
            setTeased(false);
          }}
          aria-label="Chat with City Gadgets on WhatsApp"
          aria-expanded={open}
          className="relative flex h-14 items-center gap-2 overflow-hidden rounded-full bg-whatsapp-green pl-4 pr-4 text-white shadow-card-lg transition-transform hover:scale-105 active:scale-95"
        >
          <motion.span
            animate={open ? { rotate: 0 } : { rotate: [0, -12, 10, -6, 0] }}
            transition={{ duration: 1.1, repeat: open ? 0 : Infinity, repeatDelay: 4.5 }}
            className="shrink-0"
          >
            <WhatsAppIcon className="h-7 w-7" />
          </motion.span>

          <span
            className={`overflow-hidden whitespace-nowrap text-sm font-bold transition-all duration-500 ${
              labelOut ? "max-w-[190px] opacity-100" : "max-w-0 opacity-0"
            }`}
          >
            <span className="pl-0.5 pr-1">How can we help?</span>
          </span>
        </button>
      </div>
    </div>
  );
}
