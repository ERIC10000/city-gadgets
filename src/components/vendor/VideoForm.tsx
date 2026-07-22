"use client";

import { useState, useTransition } from "react";
import { Icon } from "@/components/ui/Icon";
import { VideoUploader } from "@/components/vendor/VideoUploader";
import type { Product } from "@/lib/types";
import type { VideoFormResult } from "@/lib/actions/videos";

const inputClass =
  "w-full rounded-xl border border-outline-variant bg-white px-4 py-2.5 text-body-sm text-on-surface placeholder:text-on-surface-variant/60 focus:border-on-surface focus:outline-none";

export function VideoForm({
  action,
  products = [],
}: {
  action: (formData: FormData) => Promise<VideoFormResult>;
  products?: Product[];
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    if (!String(formData.get("videoUrl") ?? "")) {
      setError("Upload a video file first.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await action(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div>
        <label className="mb-1.5 block text-body-sm font-semibold text-on-surface">Video file</label>
        <VideoUploader />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-body-sm font-semibold text-on-surface">Title</label>
          <input name="title" required placeholder="e.g. iPhone 17 Pro Max — unboxed in Nairobi" className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-body-sm font-semibold text-on-surface">Description</label>
          <textarea
            name="description"
            rows={3}
            placeholder="What should shoppers notice? Keep it short and punchy."
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-body-sm font-semibold text-on-surface">Category</label>
          <input name="category" placeholder="e.g. Smartphones" className={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-body-sm font-semibold text-on-surface">Shoppable product</label>
          <select name="productId" defaultValue="" className={inputClass}>
            <option value="">No product link</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-badge-text text-on-surface-variant">
            Linked videos show a Buy button over the player — big conversion win.
          </p>
        </div>
      </div>

      {error && (
        <p className="flex items-start gap-2 rounded-xl bg-error-container p-3 text-body-sm font-semibold text-on-error-container">
          <Icon name="error" className="mt-0.5 text-[16px]" />
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="flex items-center gap-2 rounded-xl bg-primary px-8 py-3 font-bold text-on-primary transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {pending ? (
          <>
            <Icon name="progress_activity" className="animate-spin" />
            Publishing…
          </>
        ) : (
          <>
            <Icon name="publish" />
            Publish Video
          </>
        )}
      </button>
    </form>
  );
}
