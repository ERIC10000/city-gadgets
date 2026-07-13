"use client";

import { useState, useTransition } from "react";
import type { VideoFormResult } from "@/lib/actions/videos";

export function VideoForm({ action }: { action: (formData: FormData) => Promise<VideoFormResult> }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await action(formData);
      if (result?.error) setError(result.error);
    });
  }

  const inputClass = "w-full rounded-lg border border-outline-variant px-4 py-3 focus:border-primary focus:outline-none";

  return (
    <form action={handleSubmit} className="max-w-2xl space-y-4">
      <div>
        <label className="mb-1 block text-body-sm font-semibold text-on-surface-variant">Title</label>
        <input name="title" required className={inputClass} />
      </div>
      <div>
        <label className="mb-1 block text-body-sm font-semibold text-on-surface-variant">Description</label>
        <textarea name="description" rows={3} className={inputClass} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-body-sm font-semibold text-on-surface-variant">Category</label>
          <input name="category" placeholder="e.g. Gaming" className={inputClass} />
        </div>
        <div>
          <label className="mb-1 block text-body-sm font-semibold text-on-surface-variant">Duration (seconds)</label>
          <input type="number" name="durationSeconds" className={inputClass} />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-body-sm font-semibold text-on-surface-variant">Video URL (MP4 or stream)</label>
        <input name="videoUrl" required placeholder="https://…/video.mp4" className={inputClass} />
      </div>
      <div>
        <label className="mb-1 block text-body-sm font-semibold text-on-surface-variant">Thumbnail URL</label>
        <input name="thumbnailUrl" placeholder="https://images.unsplash.com/…" className={inputClass} />
      </div>
      <p className="text-body-sm text-on-surface-variant">
        Upload video files to your Supabase <code className="rounded bg-surface-container-highest px-1 py-0.5 text-badge-text">media</code> bucket
        and paste the public URL here.
      </p>

      {error && <p className="text-body-sm font-semibold text-error">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-xl bg-primary px-8 py-3 font-bold text-on-primary transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Publishing…" : "Publish Video"}
      </button>
    </form>
  );
}
