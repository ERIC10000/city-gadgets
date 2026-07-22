"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/env";
import { cn } from "@/lib/utils";

const MAX_MB = 100;

/**
 * Uploads a video to the Supabase `media` bucket and, in the browser, grabs a
 * poster frame + duration from the file itself so vendors never have to supply
 * a separate thumbnail.
 */
export function VideoUploader({
  initialVideoUrl = "",
  initialThumbnailUrl = "",
  initialDuration = "",
}: {
  initialVideoUrl?: string;
  initialThumbnailUrl?: string;
  initialDuration?: string | number;
}) {
  const [videoUrl, setVideoUrl] = useState(initialVideoUrl);
  const [thumbUrl, setThumbUrl] = useState(initialThumbnailUrl);
  const [duration, setDuration] = useState(String(initialDuration ?? ""));
  const [busy, setBusy] = useState<null | string>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  /** Decode the file locally to read duration and snapshot a poster frame. */
  function probe(file: File): Promise<{ duration: number; poster: Blob | null }> {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.muted = true;
      video.src = URL.createObjectURL(file);
      const done = (duration: number, poster: Blob | null) => {
        URL.revokeObjectURL(video.src);
        resolve({ duration, poster });
      };
      video.onloadedmetadata = () => {
        const d = Math.round(video.duration || 0);
        // Seek slightly in — frame 0 is often black.
        video.currentTime = Math.min(1, video.duration / 3 || 0);
        video.onseeked = () => {
          try {
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
            canvas.toBlob((b) => done(d, b), "image/jpeg", 0.82);
          } catch {
            done(d, null);
          }
        };
        video.onerror = () => done(d, null);
      };
      video.onerror = () => done(0, null);
    });
  }

  async function upload(file: File) {
    setError(null);
    if (!file.type.startsWith("video/")) {
      setError("That file isn't a video — upload an MP4, MOV or WebM.");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`"${file.name}" is over ${MAX_MB}MB. Compress it or trim it shorter.`);
      return;
    }

    let supabase;
    try {
      supabase = createClient();
    } catch {
      setError("Connect Supabase to upload video files.");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError("Your session expired — sign in again to upload.");
      return;
    }

    try {
      setBusy("Reading video…");
      const { duration: secs, poster } = await probe(file);
      if (secs) setDuration(String(secs));

      setBusy("Uploading video…");
      const base = `${user.id}/videos/${Date.now()}`;
      const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").slice(-60);
      const videoPath = `${base}-${safe}`;
      const { error: vErr } = await supabase.storage.from("media").upload(videoPath, file, {
        cacheControl: "31536000",
        upsert: false,
      });
      if (vErr) {
        setError(`Upload failed: ${vErr.message}`);
        return;
      }
      setVideoUrl(supabase.storage.from("media").getPublicUrl(videoPath).data.publicUrl);

      if (poster) {
        setBusy("Saving cover frame…");
        const posterPath = `${base}-poster.jpg`;
        const { error: pErr } = await supabase.storage.from("media").upload(posterPath, poster, {
          cacheControl: "31536000",
          contentType: "image/jpeg",
          upsert: false,
        });
        if (!pErr) setThumbUrl(supabase.storage.from("media").getPublicUrl(posterPath).data.publicUrl);
      }
    } finally {
      setBusy(null);
    }
  }

  return (
    <div>
      {/* Values the server action reads */}
      <input type="hidden" name="videoUrl" value={videoUrl} />
      <input type="hidden" name="thumbnailUrl" value={thumbUrl} />
      <input type="hidden" name="durationSeconds" value={duration} />

      {videoUrl ? (
        <div className="overflow-hidden rounded-2xl border border-outline-variant bg-black">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video src={videoUrl} poster={thumbUrl || undefined} controls className="max-h-[320px] w-full bg-black" />
          <div className="flex items-center justify-between gap-3 bg-white px-4 py-3">
            <p className="flex items-center gap-1.5 text-body-sm font-semibold text-secondary">
              <Icon name="check_circle" className="text-[16px]" />
              Uploaded{duration ? ` · ${duration}s` : ""}
              {thumbUrl ? " · cover captured" : ""}
            </p>
            <button
              type="button"
              onClick={() => {
                setVideoUrl("");
                setThumbUrl("");
                setDuration("");
              }}
              className="text-body-sm font-bold text-on-surface-variant hover:text-error"
            >
              Replace
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            if (e.dataTransfer.files[0]) upload(e.dataTransfer.files[0]);
          }}
          disabled={!!busy}
          className={cn(
            "flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-colors",
            dragging ? "border-secondary bg-secondary-container/30" : "border-outline-variant bg-surface-container-low hover:border-on-surface/40",
          )}
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-container-high text-on-primary-container">
            <Icon name={busy ? "progress_activity" : "videocam"} className={cn("text-[28px]", busy && "animate-spin")} />
          </span>
          <span className="font-semibold text-on-surface">{busy ?? "Drag & drop a video, or click to browse"}</span>
          <span className="text-badge-text text-on-surface-variant">
            MP4 / MOV / WebM · up to {MAX_MB}MB · vertical 9:16 performs best
            {!isSupabaseConfigured() && " · needs Supabase connected"}
          </span>
        </button>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) upload(e.target.files[0]);
          e.target.value = "";
        }}
      />

      {error && (
        <p className="mt-3 flex items-start gap-2 rounded-xl bg-error-container p-3 text-body-sm font-semibold text-on-error-container">
          <Icon name="error" className="mt-0.5 text-[16px]" />
          {error}
        </p>
      )}
    </div>
  );
}
