"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/env";
import { cn } from "@/lib/utils";

const MAX_FILES = 8;
const MAX_SIZE_MB = 8;

export function ImageUploader({
  initialUrls,
  onChange,
}: {
  initialUrls: string[];
  onChange?: (urls: string[]) => void;
}) {
  const [urls, setUrls] = useState<string[]>(initialUrls);
  const [uploading, setUploading] = useState(0); // number of in-flight uploads
  const [error, setError] = useState<string | null>(null);
  const [urlDraft, setUrlDraft] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canUploadFiles = isSupabaseConfigured();

  function commit(next: string[]) {
    setUrls(next);
    onChange?.(next);
  }

  async function uploadFiles(files: FileList | File[]) {
    setError(null);
    const list = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, MAX_FILES - urls.length);
    if (list.length === 0) return;

    const oversize = list.find((f) => f.size > MAX_SIZE_MB * 1024 * 1024);
    if (oversize) {
      setError(`"${oversize.name}" is over ${MAX_SIZE_MB}MB — please compress it first.`);
      return;
    }

    let supabase;
    try {
      supabase = createClient();
    } catch {
      setError("Connect Supabase to enable direct uploads — you can still paste hosted image URLs below.");
      return;
    }

    setUploading((n) => n + list.length);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError("Your session has expired — sign in again to upload images.");
        return;
      }

      let current = urls;
      for (const file of list) {
        const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").slice(-60);
        // Storage policy requires the first folder segment to be the user's id.
        const path = `${user.id}/products/${Date.now()}-${safeName}`;
        const { error: upErr } = await supabase.storage.from("media").upload(path, file, {
          cacheControl: "31536000",
          upsert: false,
        });
        if (upErr) {
          setError(`Upload failed for "${file.name}": ${upErr.message}`);
          continue;
        }
        const { data } = supabase.storage.from("media").getPublicUrl(path);
        if (data?.publicUrl) {
          current = [...current, data.publicUrl].slice(0, MAX_FILES);
          commit(current);
        }
      }
    } finally {
      setUploading((n) => Math.max(0, n - list.length));
    }
  }

  function addUrl() {
    const u = urlDraft.trim();
    if (!/^https?:\/\//.test(u)) {
      setError("Paste a full image URL starting with https://");
      return;
    }
    setError(null);
    commit([...urls, u].slice(0, MAX_FILES));
    setUrlDraft("");
  }

  function remove(index: number) {
    commit(urls.filter((_, i) => i !== index));
  }

  function makeCover(index: number) {
    commit([urls[index], ...urls.filter((_, i) => i !== index)]);
  }

  return (
    <div>
      {/* The server action keeps reading `imageUrls` as newline-separated text. */}
      <input type="hidden" name="imageUrls" value={urls.join("\n")} />

      {/* Dropzone */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          uploadFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors",
          dragging ? "border-secondary bg-secondary-container/30" : "border-outline-variant bg-surface-container-low hover:border-on-surface/40",
        )}
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-high text-on-primary-container">
          <Icon name={uploading > 0 ? "progress_activity" : "add_photo_alternate"} className={cn("text-[26px]", uploading > 0 && "animate-spin")} />
        </span>
        <span className="font-semibold text-on-surface">
          {uploading > 0 ? `Uploading ${uploading} image${uploading > 1 ? "s" : ""}…` : "Drag & drop photos, or click to browse"}
        </span>
        <span className="text-badge-text text-on-surface-variant">
          Up to {MAX_FILES} images · JPG/PNG/WebP · max {MAX_SIZE_MB}MB each
          {!canUploadFiles && " · direct upload needs Supabase connected"}
        </span>
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) uploadFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {/* URL fallback */}
      <div className="mt-3 flex gap-2">
        <input
          value={urlDraft}
          onChange={(e) => setUrlDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addUrl();
            }
          }}
          placeholder="…or paste a hosted image URL"
          className="w-full flex-1 rounded-xl border border-outline-variant bg-white px-4 py-2.5 text-body-sm placeholder:text-on-surface-variant/60 focus:border-on-surface focus:outline-none"
        />
        <button
          type="button"
          onClick={addUrl}
          className="shrink-0 rounded-xl border border-outline-variant px-4 py-2.5 text-body-sm font-bold text-on-surface transition-colors hover:border-on-surface"
        >
          Add
        </button>
      </div>

      {error && (
        <p className="mt-3 flex items-start gap-2 rounded-xl bg-error-container p-3 text-body-sm font-semibold text-on-error-container">
          <Icon name="error" className="mt-0.5 text-[16px]" />
          {error}
        </p>
      )}

      {/* Thumbnails */}
      {urls.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {urls.map((url, i) => (
            <div
              key={url + i}
              className="group relative aspect-square overflow-hidden rounded-xl border border-outline-variant bg-white"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Product image ${i + 1}`}
                className="h-full w-full object-contain p-1"
                onError={(e) => {
                  e.currentTarget.style.opacity = "0.25";
                }}
              />
              {i === 0 ? (
                <span className="absolute bottom-1 left-1 rounded bg-on-surface px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
                  Cover
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => makeCover(i)}
                  className="absolute bottom-1 left-1 rounded bg-white/90 px-1.5 py-0.5 text-[9px] font-bold uppercase text-on-surface opacity-0 transition-opacity group-hover:opacity-100"
                >
                  Set cover
                </button>
              )}
              <button
                type="button"
                onClick={() => remove(i)}
                aria-label="Remove image"
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-on-surface opacity-0 shadow transition-opacity hover:text-error group-hover:opacity-100"
              >
                <Icon name="close" className="text-[14px]" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
