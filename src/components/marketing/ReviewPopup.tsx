"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { GOOGLE_REVIEW_URL } from "@/lib/contact";

const STORAGE_KEY = "cg_review_prompt_v1";
const SHOW_AFTER_MS = 30_000; // ~30s of browsing before we ask
const SNOOZE_DAYS = 14; // how long "Maybe later" hides it for

/** Full-colour Google "G" so the review CTA is instantly recognisable. */
function GoogleG({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

/**
 * Timed Google-review prompt. Appears once the visitor has been browsing for a
 * while, then sends them to the Google Business Profile review page (Google
 * handles sign-in and hosts the review — there is no way to post a Google
 * review from our own form). Dismissals are remembered so it never nags.
 *
 * Mounted in the storefront layout, so a single timer persists across
 * client-side navigation rather than restarting on every page.
 */
export function ReviewPopup() {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(0);

  useEffect(() => {
    let saved: { state?: string; ts?: number } | null = null;
    try {
      saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    } catch {
      saved = null;
    }
    if (saved?.state === "reviewed") return; // already sent to Google — don't ask again
    if (saved?.state === "snoozed" && saved.ts && Date.now() - saved.ts < SNOOZE_DAYS * 86_400_000) return;

    const timer = setTimeout(() => {
      const path = window.location.pathname;
      // Never interrupt an active checkout/cart.
      if (path.startsWith("/checkout") || path.startsWith("/cart")) return;
      setOpen(true);
    }, SHOW_AFTER_MS);
    return () => clearTimeout(timer);
  }, []);

  // Lock background scroll + allow Escape to dismiss while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") snooze();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function persist(state: "reviewed" | "snoozed") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ state, ts: Date.now() }));
    } catch {
      /* private mode — ignore */
    }
  }

  function snooze() {
    persist("snoozed");
    setOpen(false);
  }

  function goToGoogle() {
    persist("reviewed");
    window.open(GOOGLE_REVIEW_URL, "_blank", "noopener,noreferrer");
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Rate City Gadgets on Google"
      onClick={snooze}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl md:p-8"
      >
        <button
          onClick={snooze}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
        >
          <Icon name="close" />
        </button>

        <div className="flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-container-low shadow-sm ring-1 ring-outline-variant">
            <GoogleG className="h-8 w-8" />
          </span>

          <h2 className="mt-4 text-xl font-extrabold text-on-surface">Enjoying City Gadgets?</h2>
          <p className="mt-2 text-body-sm leading-relaxed text-on-surface-variant">
            Tap a star to rate us on Google — it takes 20 seconds and helps other shoppers in Kenya find us.
          </p>

          {/* Stars are an engagement hook — any rating opens Google, where you
              sign in and leave the actual review. */}
          <div className="mt-5 flex items-center gap-1" onMouseLeave={() => setHover(0)}>
            {[1, 2, 3, 4, 5].map((i) => (
              <button
                key={i}
                onMouseEnter={() => setHover(i)}
                onFocus={() => setHover(i)}
                onClick={goToGoogle}
                aria-label={`Rate ${i} star${i > 1 ? "s" : ""} on Google`}
                className="rounded p-1 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <Icon
                  name="star"
                  filled={i <= hover}
                  className={i <= hover ? "text-[34px] text-price-gold" : "text-[34px] text-outline-variant"}
                />
              </button>
            ))}
          </div>

          <button
            onClick={goToGoogle}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-on-surface px-6 py-3 font-bold text-white transition-transform hover:scale-[1.02] active:scale-95"
          >
            <GoogleG className="h-5 w-5" />
            Review us on Google
          </button>

          <button
            onClick={snooze}
            className="mt-3 text-body-sm font-semibold text-on-surface-variant transition-colors hover:text-on-surface"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
