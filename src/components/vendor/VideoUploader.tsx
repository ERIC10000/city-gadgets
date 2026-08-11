"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/env";
import { createWebpEncoder, encodeCanvasAsWebp, fitImageDimensions, type WebpEncoder } from "@/lib/image-upload";
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
  onBusyChange,
}: {
  initialVideoUrl?: string;
  initialThumbnailUrl?: string;
  initialDuration?: string | number;
  onBusyChange?: (busy: boolean) => void;
}) {
  const [videoUrl, setVideoUrl] = useState(initialVideoUrl);
  const [thumbUrl, setThumbUrl] = useState(initialThumbnailUrl);
  const [duration, setDuration] = useState(String(initialDuration ?? ""));
  const [busy, setBusy] = useState<null | string>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const uploadInProgressRef = useRef(false);

  /** Decode the file locally to read duration and snapshot a poster frame. */
  function probe(file: File, encoder: WebpEncoder): Promise<{ duration: number; poster: Blob | null }> {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      const objectUrl = URL.createObjectURL(file);
      let settled = false;
      let detectedDuration = 0;
      const timeout = window.setTimeout(() => finish(detectedDuration, null), 15000);

      const cleanup = () => {
        window.clearTimeout(timeout);
        video.onloadedmetadata = null;
        video.onseeked = null;
        video.onerror = null;
        video.pause();
        video.removeAttribute("src");
        video.load();
        URL.revokeObjectURL(objectUrl);
      };
      const finish = (duration: number, poster: Blob | null) => {
        if (settled) return;
        settled = true;
        cleanup();
        resolve({ duration, poster });
      };
      const capture = async () => {
        const canvas = document.createElement("canvas");
        try {
          const dimensions = fitImageDimensions(video.videoWidth, video.videoHeight);
          canvas.width = dimensions.width;
          canvas.height = dimensions.height;
          const context = canvas.getContext("2d");
          if (!context) throw new Error("Video frame capture is unavailable.");
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          finish(detectedDuration, await encodeCanvasAsWebp(canvas, encoder));
        } catch {
          finish(detectedDuration, null);
        } finally {
          canvas.width = 0;
          canvas.height = 0;
        }
      };

      video.preload = "metadata";
      video.muted = true;
      video.playsInline = true;
      video.src = objectUrl;
      video.onloadedmetadata = () => {
        detectedDuration = Math.round(video.duration || 0);
        video.onseeked = capture;
        // Seek slightly in — frame 0 is often black.
        const target = Math.min(1, video.duration / 3 || 0);
        if (target > 0) video.currentTime = target;
        else void capture();
      };
      video.onerror = () => finish(detectedDuration, null);
    });
  }

  async function upload(file: File) {
    if (uploadInProgressRef.current) return;
    setError(null);
    if (!file.type.startsWith("video/")) {
      setError("That file isn't a video — upload an MP4, MOV or WebM.");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`"${file.name}" is over ${MAX_MB}MB. Compress it or trim it shorter.`);
      return;
    }

    uploadInProgressRef.current = true;
    setBusy("Preparing upload…");
    onBusyChange?.(true);
    let encoder: WebpEncoder | null = null;
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError("Your session expired — sign in again to upload.");
        return;
      }

      encoder = createWebpEncoder();
      setBusy("Reading video…");
      const { duration: secs, poster } = await probe(file, encoder);

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
      const nextVideoUrl = supabase.storage.from("media").getPublicUrl(videoPath).data.publicUrl;
      let nextThumbUrl = "";

      if (poster) {
        setBusy("Saving cover frame…");
        const posterPath = `${base}-poster.webp`;
        const { error: pErr } = await supabase.storage.from("media").upload(posterPath, poster, {
          cacheControl: "31536000",
          contentType: "image/webp",
          upsert: false,
        });
        if (pErr) setError(`Video uploaded, but the cover frame failed: ${pErr.message}`);
        else nextThumbUrl = supabase.storage.from("media").getPublicUrl(posterPath).data.publicUrl;
      }
      setDuration(secs ? String(secs) : "");
      setThumbUrl(nextThumbUrl);
      setVideoUrl(nextVideoUrl);
    } catch (uploadError) {
      const message = uploadError instanceof Error ? uploadError.message : "Video upload failed.";
      setError(message.includes("Supabase") ? "Connect Supabase to upload video files." : message);
    } finally {
      encoder?.terminate();
      uploadInProgressRef.current = false;
      setBusy(null);
      onBusyChange?.(false);
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
