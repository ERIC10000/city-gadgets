"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { formatKES } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ShoppableVideo } from "@/lib/data/videos";

/** mm:ss, with a stable placeholder before metadata lands. */
function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/**
 * Full-bleed vertical reel. Autoplays muted while in view (the only autoplay
 * browsers allow), pauses when scrolled away, and surfaces a shoppable card
 * for the linked product.
 */
function Reel({ video, active }: { video: ShoppableVideo; active: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [scrubbing, setScrubbing] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (active) {
      el.play().then(() => setPaused(false)).catch(() => setPaused(true));
    } else {
      el.pause();
      el.currentTime = 0;
      setProgress(0);
      setElapsed(0);
    }
  }, [active]);

  // React doesn't reliably reflect the `muted` prop to the DOM property, so
  // the mute button appears to do nothing — sync it imperatively.
  useEffect(() => {
    if (ref.current) ref.current.muted = muted;
  }, [muted]);

  function toggle() {
    const el = ref.current;
    if (!el) return;
    if (el.paused) {
      el.play();
      setPaused(false);
    } else {
      el.pause();
      setPaused(true);
    }
  }

  /** Jump by a signed number of seconds, clamped to the clip. */
  function seekBy(seconds: number) {
    const el = ref.current;
    if (!el || !el.duration) return;
    el.currentTime = Math.min(Math.max(el.currentTime + seconds, 0), el.duration);
  }

  /** Scrub from a pointer position on the track. */
  function seekToRatio(ratio: number) {
    const el = ref.current;
    if (!el || !el.duration) return;
    el.currentTime = Math.min(Math.max(ratio, 0), 1) * el.duration;
  }

  return (
    <section className="relative flex h-[100svh] snap-start snap-always items-center justify-center bg-black">
      {/* Blurred backdrop fills the letterbox on wide screens */}
      {video.thumbnail_url && (
        <Image src={video.thumbnail_url} alt="" fill sizes="100vw" className="scale-110 object-cover opacity-25 blur-2xl" />
      )}

      <div className="relative h-full w-full max-w-[500px] overflow-hidden bg-black md:my-3 md:h-[calc(100%-1.5rem)] md:rounded-3xl">
        {/* Blurred fill so a contained (never-cropped) video sits on soft bars, not stark black */}
        {video.thumbnail_url && (
          <Image src={video.thumbnail_url} alt="" fill sizes="520px" className="scale-125 object-cover opacity-40 blur-2xl" />
        )}
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          ref={ref}
          src={video.video_url}
          poster={video.thumbnail_url ?? undefined}
          muted={muted}
          loop
          playsInline
          preload="metadata"
          onClick={toggle}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)}
          onTimeUpdate={(e) => {
            const v = e.currentTarget;
            setElapsed(v.currentTime);
            if (v.duration) setProgress((v.currentTime / v.duration) * 100);
          }}
          className="relative h-full w-full cursor-pointer object-contain"
        />

        {/* Legibility scrim */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        {/* Play affordance when paused */}
        {paused && (
          <button
            onClick={toggle}
            aria-label="Play video"
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
              <Icon name="play_arrow" filled className="text-5xl text-white" />
            </span>
          </button>
        )}

        {/* Mute toggle */}
        <button
          onClick={() => setMuted((m) => !m)}
          aria-label={muted ? "Unmute" : "Mute"}
          className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white ring-1 ring-white/15 backdrop-blur-md transition-all hover:bg-black/70 active:scale-95"
        >
          <Icon name={muted ? "volume_off" : "volume_up"} />
        </button>

        {muted && active && (
          <span className="pointer-events-none absolute right-16 top-6 rounded-full bg-black/60 px-3 py-1 text-badge-text font-bold text-white backdrop-blur-sm">
            Tap for sound
          </span>
        )}

        {/* Double-tap seek zones — invisible, sit behind the caption block */}
        <button
          onDoubleClick={() => seekBy(-10)}
          aria-label="Rewind 10 seconds"
          tabIndex={-1}
          className="absolute inset-y-0 left-0 w-1/4 cursor-default"
        />
        <button
          onDoubleClick={() => seekBy(10)}
          aria-label="Forward 10 seconds"
          tabIndex={-1}
          className="absolute inset-y-0 right-0 w-1/4 cursor-default"
        />

        {/* Caption + shoppable card — bottom padding clears the transport bar
            (and, on mobile, the tab bar beneath it) */}
        <div className="absolute inset-x-0 bottom-0 space-y-3 p-5 pb-32 md:pb-24">
          {video.category && (
            <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-badge-text font-bold uppercase tracking-wide text-white backdrop-blur-sm">
              {video.category}
            </span>
          )}
          <h2 className="text-xl font-extrabold leading-tight text-white">{video.title}</h2>
          {video.description && (
            <div>
              <p
                className={cn(
                  "whitespace-pre-line text-body-sm text-white/80",
                  showFullDesc ? "max-h-[38vh] overflow-y-auto pr-1" : "line-clamp-2",
                )}
              >
                {video.description}
              </p>
              {video.description.length > 90 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowFullDesc((v) => !v);
                  }}
                  className="mt-1 text-body-sm font-bold text-white underline underline-offset-2"
                >
                  {showFullDesc ? "Show less" : "Read more"}
                </button>
              )}
            </div>
          )}

          {video.product ? (
            <Link
              href={`/product/${video.product.slug}`}
              className="group flex items-center gap-3 rounded-2xl bg-white/95 p-3 backdrop-blur transition-transform hover:scale-[1.02]"
            >
              <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-outline-variant bg-white">
                {video.product.image && (
                  <Image src={video.product.image} alt="" fill sizes="56px" className="object-contain p-1" />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="line-clamp-1 block text-body-sm font-bold text-on-surface">{video.product.name}</span>
                <span className="text-body-sm font-extrabold text-on-surface">{formatKES(video.product.price)}</span>
              </span>
              <span className="flex shrink-0 items-center gap-1 rounded-full bg-on-surface px-4 py-2.5 text-body-sm font-bold text-white">
                Shop
                <Icon name="arrow_forward" className="text-[16px]" />
              </span>
            </Link>
          ) : (
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-body-sm font-bold text-on-surface"
            >
              Shop the store
              <Icon name="arrow_forward" className="text-[16px]" />
            </Link>
          )}
        </div>

        {/* Transport controls — scrub track plus playback cluster */}
        <div className="absolute inset-x-0 bottom-0 px-4 pb-7 md:pb-4">
          <div className="rounded-2xl bg-black/45 px-3 py-2.5 ring-1 ring-white/10 backdrop-blur-md">
            {/* Scrub track — click or drag anywhere to seek */}
            <div
              role="slider"
              tabIndex={0}
              aria-label="Seek"
              aria-valuemin={0}
              aria-valuemax={Math.round(duration)}
              aria-valuenow={Math.round(elapsed)}
              aria-valuetext={`${formatTime(elapsed)} of ${formatTime(duration)}`}
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft") seekBy(-5);
                if (e.key === "ArrowRight") seekBy(5);
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  toggle();
                }
              }}
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                setScrubbing(true);
                const r = e.currentTarget.getBoundingClientRect();
                seekToRatio((e.clientX - r.left) / r.width);
              }}
              onPointerMove={(e) => {
                if (!scrubbing) return;
                const r = e.currentTarget.getBoundingClientRect();
                seekToRatio((e.clientX - r.left) / r.width);
              }}
              onPointerUp={() => setScrubbing(false)}
              onPointerCancel={() => setScrubbing(false)}
              className="group relative flex cursor-pointer touch-none items-center py-2"
            >
              <div className="h-1 w-full overflow-hidden rounded-full bg-white/25">
                <div
                  className={cn("h-full rounded-full bg-white", !scrubbing && "transition-[width] duration-200")}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span
                className={cn(
                  "absolute h-3 w-3 -translate-x-1/2 rounded-full bg-white shadow transition-transform",
                  scrubbing ? "scale-100" : "scale-0 group-hover:scale-100",
                )}
                style={{ left: `${progress}%` }}
                aria-hidden="true"
              />
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={toggle}
                aria-label={paused ? "Play" : "Pause"}
                className="flex h-9 w-9 items-center justify-center rounded-full text-white transition-colors hover:bg-white/15 active:scale-95"
              >
                <Icon name={paused ? "play_arrow" : "pause"} filled className="text-[22px]" />
              </button>
              <button
                onClick={() => seekBy(-10)}
                aria-label="Rewind 10 seconds"
                className="flex h-9 w-9 items-center justify-center rounded-full text-white transition-colors hover:bg-white/15 active:scale-95"
              >
                <Icon name="replay_10" className="text-[20px]" />
              </button>
              <button
                onClick={() => seekBy(10)}
                aria-label="Forward 10 seconds"
                className="flex h-9 w-9 items-center justify-center rounded-full text-white transition-colors hover:bg-white/15 active:scale-95"
              >
                <Icon name="forward_10" className="text-[20px]" />
              </button>

              <span className="ml-1 font-mono text-[11px] tabular-nums text-white/85">
                {formatTime(elapsed)} <span className="text-white/40">/ {formatTime(duration)}</span>
              </span>

              <button
                onClick={() => setMuted((m) => !m)}
                aria-label={muted ? "Unmute" : "Mute"}
                className="ml-auto flex h-9 w-9 items-center justify-center rounded-full text-white transition-colors hover:bg-white/15 active:scale-95"
              >
                <Icon name={muted ? "volume_off" : "volume_up"} className="text-[20px]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function InspirationFeed({ videos }: { videos: ShoppableVideo[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Track which reel is on screen so only that one plays.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const i = Number((entry.target as HTMLElement).dataset.index);
            if (!Number.isNaN(i)) setActiveIndex(i);
          }
        });
      },
      { threshold: 0.6 },
    );
    sectionRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [videos.length]);

  const scrollTo = useCallback((i: number) => {
    sectionRefs.current[i]?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Immersive takeover: lock the page behind so the feed is the whole screen.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  if (videos.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 bg-black px-6 text-center text-white">
        <Icon name="smart_display" className="text-5xl text-white/40" />
        <h1 className="text-xl font-extrabold">No videos yet</h1>
        <p className="max-w-sm text-body-sm text-white/60">
          Product videos will appear here as soon as they&apos;re published from the vendor studio.
        </p>
        <Link href="/shop" className="mt-2 rounded-full bg-white px-6 py-3 text-body-sm font-bold text-black">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[70] bg-black">
      {/* Exit back to the store — the header/nav are covered by this overlay */}
      <Link
        href="/"
        aria-label="Back to store"
        className="absolute left-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white ring-1 ring-white/15 backdrop-blur-md transition-colors hover:bg-black/70"
        style={{ top: "max(1rem, env(safe-area-inset-top))" }}
      >
        <Icon name="arrow_back" />
      </Link>

      <div
        ref={containerRef}
        className="no-scrollbar h-[100svh] snap-y snap-mandatory overflow-y-auto overscroll-y-contain"
      >
        {videos.map((v, i) => (
          <div
            key={v.id}
            data-index={i}
            ref={(el) => {
              sectionRefs.current[i] = el;
            }}
          >
            <Reel video={v} active={i === activeIndex} />
          </div>
        ))}
      </div>

      {/* Desktop pager */}
      <div className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-3 md:flex">
        <button
          onClick={() => scrollTo(Math.max(0, activeIndex - 1))}
          disabled={activeIndex === 0}
          aria-label="Previous video"
          className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20 disabled:opacity-30"
        >
          <Icon name="keyboard_arrow_up" />
        </button>
        <div className="flex flex-col gap-1.5">
          {videos.map((_, i) => (
            <span
              key={i}
              className={cn("w-1 rounded-full transition-all", i === activeIndex ? "h-6 bg-white" : "h-1.5 bg-white/40")}
            />
          ))}
        </div>
        <button
          onClick={() => scrollTo(Math.min(videos.length - 1, activeIndex + 1))}
          disabled={activeIndex === videos.length - 1}
          aria-label="Next video"
          className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20 disabled:opacity-30"
        >
          <Icon name="keyboard_arrow_down" />
        </button>
      </div>
    </div>
  );
}
