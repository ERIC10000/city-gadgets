"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/env";
import { createWebpEncoder, prepareImageForUpload, safeImageStem } from "@/lib/image-upload";
import { cn } from "@/lib/utils";

const MAX_FILES = 8;
const MAX_SIZE_MB = 8;

export function ImageUploader({
  initialUrls,
  onChange,
  onBusyChange,
}: {
  initialUrls: string[];
  onChange?: (urls: string[]) => void;
  onBusyChange?: (busy: boolean) => void;
}) {
  const [urls, setUrls] = useState<string[]>(initialUrls);
  const [uploading, setUploading] = useState(0); // number of in-flight uploads
  const [error, setError] = useState<string | null>(null);
  const [urlDraft, setUrlDraft] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const urlsRef = useRef(initialUrls);
  const uploadInProgressRef = useRef(false);

  const canUploadFiles = isSupabaseConfigured();

  function commit(next: string[]) {
    urlsRef.current = next;
    setUrls(next);
    onChange?.(next);
  }

  async function uploadFiles(files: FileList | File[]) {
    if (uploadInProgressRef.current) return;
    setError(null);
    const availableSlots = Math.max(0, MAX_FILES - urlsRef.current.length);
    const list = Array.from(files).slice(0, availableSlots);
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

    uploadInProgressRef.current = true;
    setUploading(list.length);
    onBusyChange?.(true);
    let encoder: ReturnType<typeof createWebpEncoder> | null = null;
    try {
      encoder = createWebpEncoder();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError("Your session has expired — sign in again to upload images.");
        return;
      }

      const failures: string[] = [];
      for (const file of list) {
        try {
          const prepared = await prepareImageForUpload(file, encoder);
          const path = `${user.id}/products/${crypto.randomUUID()}-${safeImageStem(prepared.file.name)}.webp`;
          const { error: upErr } = await supabase.storage.from("media").upload(path, prepared.file, {
            cacheControl: "31536000",
            contentType: "image/webp",
            upsert: false,
          });
          if (upErr) throw new Error(upErr.message);

          const { data } = supabase.storage.from("media").getPublicUrl(path);
          if (data?.publicUrl) {
            commit([...urlsRef.current, data.publicUrl].slice(0, MAX_FILES));
          }
        } catch (uploadError) {
          failures.push(
            `"${file.name}": ${uploadError instanceof Error ? uploadError.message : "upload failed"}`,
          );
        }
      }
      if (failures.length) setError(failures.join(" "));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Image upload failed.");
    } finally {
      encoder?.terminate();
      uploadInProgressRef.current = false;
      setUploading(0);
      onBusyChange?.(false);
    }
  }

  function addUrl() {
    const u = urlDraft.trim();
    let parsed: URL;
    try {
      parsed = new URL(u);
    } catch {
      setError("Paste a valid hosted image URL.");
      return;
    }
    if (parsed.protocol !== "https:") {
      setError("Paste a full image URL starting with https://");
      return;
    }
    if (!parsed.pathname.toLowerCase().endsWith(".webp")) {
      setError("Hosted image URLs must point to a .webp file. Upload JPG or PNG files above to convert them automatically.");
      return;
    }
    setError(null);
    commit([...urlsRef.current, u].slice(0, MAX_FILES));
    setUrlDraft("");
  }

  function remove(index: number) {
    commit(urlsRef.current.filter((_, i) => i !== index));
  }

  function makeCover(index: number) {
    commit([urlsRef.current[index], ...urlsRef.current.filter((_, i) => i !== index)]);
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
        disabled={uploading > 0}
        aria-busy={uploading > 0}
        className={cn(
          "flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors disabled:cursor-wait disabled:opacity-70",
          dragging ? "border-secondary bg-secondary-container/30" : "border-outline-variant bg-surface-container-low hover:border-on-surface/40",
        )}
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-high text-on-primary-container">
          <Icon name={uploading > 0 ? "progress_activity" : "add_photo_alternate"} className={cn("text-[26px]", uploading > 0 && "animate-spin")} />
        </span>
        <span className="font-semibold text-on-surface">
          {uploading > 0
            ? `Optimizing and uploading ${uploading} image${uploading > 1 ? "s" : ""}…`
            : "Drag & drop photos, or click to browse"}
        </span>
        <span className="text-badge-text text-on-surface-variant">
          Up to {MAX_FILES} images · JPG/PNG converted to WebP · max {MAX_SIZE_MB}MB each
          {!canUploadFiles && " · direct upload needs Supabase connected"}
        </span>
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
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
          placeholder="…or paste a hosted WebP URL"
          disabled={uploading > 0}
          className="w-full flex-1 rounded-xl border border-outline-variant bg-white px-4 py-2.5 text-body-sm placeholder:text-on-surface-variant/60 focus:border-on-surface focus:outline-none"
        />
        <button
          type="button"
          onClick={addUrl}
          disabled={uploading > 0}
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
                  disabled={uploading > 0}
                  className="absolute bottom-1 left-1 rounded bg-white/90 px-1.5 py-0.5 text-[9px] font-bold uppercase text-on-surface opacity-0 transition-opacity group-hover:opacity-100"
                >
                  Set cover
                </button>
              )}
              <button
                type="button"
                onClick={() => remove(i)}
                disabled={uploading > 0}
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
