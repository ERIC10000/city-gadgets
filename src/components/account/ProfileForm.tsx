"use client";

import { useState, useTransition } from "react";
import { updateProfile, type AuthResult } from "@/lib/actions/auth";

export function ProfileForm({ fullName, phone }: { fullName: string; phone: string }) {
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setSaved(false);
    setError(null);
    startTransition(async () => {
      const result: AuthResult = await updateProfile(formData);
      if (result?.error) setError(result.error);
      else setSaved(true);
    });
  }

  return (
    <form action={handleSubmit} className="max-w-md space-y-4">
      <div>
        <label className="mb-1 block text-body-sm font-semibold text-on-surface-variant">Full Name</label>
        <input
          name="fullName"
          defaultValue={fullName}
          className="w-full rounded-lg border border-outline-variant px-4 py-3 focus:border-primary focus:outline-none"
        />
      </div>
      <div>
        <label className="mb-1 block text-body-sm font-semibold text-on-surface-variant">Phone Number</label>
        <input
          name="phone"
          defaultValue={phone}
          className="w-full rounded-lg border border-outline-variant px-4 py-3 focus:border-primary focus:outline-none"
        />
      </div>
      {error && <p className="text-body-sm font-semibold text-error">{error}</p>}
      {saved && <p className="text-body-sm font-semibold text-m-pesa-green">Profile updated.</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-xl bg-primary px-6 py-3 font-bold text-on-primary transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save Changes"}
      </button>
    </form>
  );
}
