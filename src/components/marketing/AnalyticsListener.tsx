"use client";

import { useEffect } from "react";
import { trackWhatsApp } from "@/lib/analytics";

/**
 * Captures every WhatsApp link click across the storefront (FAB, footer,
 * product page, quick-buy, repair, contact…) in one place, so they all fire the
 * `whatsapp_click` conversion without instrumenting each link individually.
 * Programmatic window.open(whatsappLink()) calls (repair/sell forms) fire it
 * themselves.
 */
export function AnalyticsListener() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      const link = target?.closest?.("a[href*='wa.me/']") as HTMLAnchorElement | null;
      if (link) trackWhatsApp("link", { url: link.href });
    }
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
  return null;
}
