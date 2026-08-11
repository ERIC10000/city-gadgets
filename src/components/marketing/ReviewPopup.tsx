"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { GOOGLE_REVIEW_URL } from "@/lib/contact";

const STORAGE_KEY = "cg_review_prompt_v1";
const SHOW_AFTER_MS = 60_000; // 60s of engaged browsing before we ask
const AUTO_HIDE_MS = 5_000; //    then it slips away after 5s
const SNOOZE_DISMISS_DAYS = 14; // "closed it" — leave them alone a while
const SNOOZE_AUTO_DAYS = 3; //    "ignored it" — try again sooner

/** Full-colour Google "G". */
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
 * Non-intrusive Google-review nudge. Slides in as a small card in the
 * bottom-right after the visitor has browsed & interacted for ~60s, plays a
 * soft chime, and auto-dismisses after 5s (paused while hovered) so it never
 * blocks what the user is doing. Sends to the Google review page — the only
 * place a Google review can actually be posted.
 */
export function ReviewPopup() {
  const [open, setOpen] = useState(false); // in the DOM
  const [entered, setEntered] = useState(false); // slide-in state
  const [paused, setPaused] = useState(false); // hover pauses auto-hide
  const [barKey, setBarKey] = useState(0); // restart the countdown bar
  const [hover, setHover] = useState(0);

  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioCtx = useRef<AudioContext | null>(null);

  const ensureAudio = useCallback(() => {
    try {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      if (!audioCtx.current) audioCtx.current = new AC();
      if (audioCtx.current.state === "suspended") void audioCtx.current.resume();
    } catch {
      /* audio unsupported — no problem */
    }
  }, []);

  /** Soft two-note chime, synthesised (no asset needed), kept low and brief. */
  const playChime = useCallback(() => {
    const ctx = audioCtx.current;
    if (!ctx || ctx.state !== "running") return;
    const now = ctx.currentTime;
    ([
      [880, 0],
      [1174.66, 0.11],
    ] as const).forEach(([freq, t]) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, now + t);
      gain.gain.linearRampToValueAtTime(0.06, now + t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + t + 0.28);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + t);
      osc.stop(now + t + 0.3);
    });
  }, []);

  const persist = useCallback((state: "reviewed" | "snoozed", days = 0) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ state, ts: Date.now(), days }));
    } catch {
      /* private mode — ignore */
    }
  }, []);

  const animateOut = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setEntered(false);
    setTimeout(() => setOpen(false), 320);
  }, []);

  const startHideTimer = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      persist("snoozed", SNOOZE_AUTO_DAYS);
      animateOut();
    }, AUTO_HIDE_MS);
  }, [animateOut, persist]);

  const show = useCallback(() => {
    setOpen(true);
    requestAnimationFrame(() => setEntered(true));
    playChime();
    setBarKey((k) => k + 1);
    startHideTimer();
  }, [playChime, startHideTimer]);

  const dismiss = useCallback(() => {
    persist("snoozed", SNOOZE_DISMISS_DAYS);
    animateOut();
  }, [animateOut, persist]);

  const review = useCallback(() => {
    persist("reviewed");
    window.open(GOOGLE_REVIEW_URL, "_blank", "noopener,noreferrer");
    animateOut();
  }, [animateOut, persist]);

  // Schedule: engaged (interacted) + 60s elapsed, for new/eligible visitors.
  useEffect(() => {
    let saved: { state?: string; ts?: number; days?: number } | null = null;
    try {
      saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    } catch {
      saved = null;
    }
    if (saved?.state === "reviewed") return;
    if (saved?.state === "snoozed" && saved.ts && Date.now() - saved.ts < (saved.days ?? SNOOZE_DISMISS_DAYS) * 86_400_000) return;

    let interacted = false;
    let elapsed = false;
    let done = false;
    const events = ["pointerdown", "keydown", "scroll", "wheel", "touchstart"] as const;

    const maybeShow = () => {
      if (done || !interacted || !elapsed) return;
      const path = window.location.pathname;
      if (path.startsWith("/checkout") || path.startsWith("/cart") || path.startsWith("/inspiration")) return;
      done = true;
      cleanup();
      show();
    };
    const onInteract = () => {
      interacted = true;
      ensureAudio();
      maybeShow();
    };
    const cleanup = () => {
      clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, onInteract));
    };

    events.forEach((e) => window.addEventListener(e, onInteract, { passive: true }));
    const timer = setTimeout(() => {
      elapsed = true;
      maybeShow();
    }, SHOW_AFTER_MS);

    return cleanup;
  }, [ensureAudio, show]);

  // Escape closes it too.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, dismiss]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label="Rate City Gadgets on Google"
      onMouseEnter={() => {
        setPaused(true);
        if (hideTimer.current) clearTimeout(hideTimer.current);
      }}
      onMouseLeave={() => {
        setPaused(false);
        setBarKey((k) => k + 1);
        startHideTimer();
      }}
      className={`fixed bottom-24 right-4 z-[75] w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-outline-variant bg-white shadow-2xl ring-1 ring-black/5 transition-all duration-300 ease-out md:right-6 ${
        entered ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
      >
        <Icon name="close" className="text-[18px]" />
      </button>

      <div className="p-4">
        <div className="flex items-start gap-3 pr-6">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-container-low ring-1 ring-outline-variant">
            <GoogleG className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-body-md font-extrabold leading-tight text-on-surface">Enjoying City Gadgets?</p>
            <p className="mt-0.5 text-badge-text text-on-surface-variant">Tap a star to rate us on Google.</p>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-0.5 pl-[52px]" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              onMouseEnter={() => setHover(i)}
              onFocus={() => setHover(i)}
              onClick={review}
              aria-label={`Rate ${i} star${i > 1 ? "s" : ""} on Google`}
              className="rounded p-0.5 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Icon name="star" filled={i <= hover} className={i <= hover ? "text-[26px] text-price-gold" : "text-[26px] text-outline-variant"} />
            </button>
          ))}
        </div>

        <button
          onClick={review}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-on-surface px-4 py-2.5 text-body-sm font-bold text-white transition-transform hover:scale-[1.02] active:scale-95"
        >
          <GoogleG className="h-4 w-4" />
          Review us on Google
        </button>
      </div>

      {/* Auto-hide countdown — pauses on hover */}
      <div className="h-1 w-full bg-surface-container">
        <div
          key={barKey}
          className="h-full bg-primary/60"
          style={{
            transformOrigin: "left",
            transform: "scaleX(1)",
            animation: `cgReviewBar ${AUTO_HIDE_MS}ms linear forwards`,
            animationPlayState: paused ? "paused" : "running",
          }}
        />
      </div>
      <style>{`@keyframes cgReviewBar{from{transform:scaleX(1)}to{transform:scaleX(0)}}`}</style>
    </div>
  );
}
