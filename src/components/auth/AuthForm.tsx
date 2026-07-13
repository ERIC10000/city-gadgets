"use client";

import { useState, useTransition } from "react";
import type { AuthResult } from "@/lib/actions/auth";

export function AuthForm({
  mode,
  action,
}: {
  mode: "login" | "signup";
  action: (formData: FormData) => Promise<AuthResult>;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await action(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      {mode === "signup" && (
        <div>
          <label className="mb-1 block text-body-sm font-semibold text-on-surface-variant">Full Name</label>
          <input
            name="fullName"
            required
            className="w-full rounded-lg border border-outline-variant px-4 py-3 focus:border-primary focus:outline-none"
          />
        </div>
      )}
      <div>
        <label className="mb-1 block text-body-sm font-semibold text-on-surface-variant">Email</label>
        <input
          type="email"
          name="email"
          required
          className="w-full rounded-lg border border-outline-variant px-4 py-3 focus:border-primary focus:outline-none"
        />
      </div>
      <div>
        <label className="mb-1 block text-body-sm font-semibold text-on-surface-variant">Password</label>
        <input
          type="password"
          name="password"
          required
          minLength={6}
          className="w-full rounded-lg border border-outline-variant px-4 py-3 focus:border-primary focus:outline-none"
        />
      </div>

      {error && <p className="text-body-sm font-semibold text-error">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="flex h-12 w-full items-center justify-center rounded-xl bg-primary font-bold text-on-primary transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
      </button>
    </form>
  );
}
