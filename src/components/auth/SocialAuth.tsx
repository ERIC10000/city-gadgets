"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Icon } from "@/components/ui/Icon";

type Provider = "google" | "facebook";

function GoogleG() {
  return (
    <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

function FacebookF() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path
        fill="#1877F2"
        d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.89v2.25h3.32l-.53 3.49h-2.79V24C19.61 23.1 24 18.1 24 12.07z"
      />
    </svg>
  );
}

export function SocialAuth({ next = "/account" }: { next?: string }) {
  const [loading, setLoading] = useState<Provider | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function signInWith(provider: Provider) {
    setError(null);
    setLoading(provider);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (error) {
        setError(error.message);
        setLoading(null);
      }
      // On success the browser is redirected to the provider — no further UI.
    } catch {
      setError("Couldn't start sign-in. Please try again.");
      setLoading(null);
    }
  }

  const btn =
    "flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-outline-variant bg-white font-bold text-on-surface transition-colors hover:bg-surface-container-low disabled:opacity-60";

  return (
    <div className="space-y-3">
      <button type="button" onClick={() => signInWith("google")} disabled={loading !== null} className={btn}>
        {loading === "google" ? <Icon name="progress_activity" className="animate-spin" /> : <GoogleG />}
        Continue with Google
      </button>
      <button type="button" onClick={() => signInWith("facebook")} disabled={loading !== null} className={btn}>
        {loading === "facebook" ? <Icon name="progress_activity" className="animate-spin" /> : <FacebookF />}
        Continue with Facebook
      </button>

      {error && <p className="text-body-sm font-semibold text-error">{error}</p>}

      <div className="flex items-center gap-3 pt-1">
        <span className="h-px flex-1 bg-outline-variant" />
        <span className="text-badge-text font-semibold uppercase tracking-wide text-on-surface-variant">or</span>
        <span className="h-px flex-1 bg-outline-variant" />
      </div>
    </div>
  );
}
