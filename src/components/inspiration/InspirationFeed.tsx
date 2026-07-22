"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { formatKES } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ShoppableVideo } from "@/lib/data/videos";

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

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (active) {
      el.play().then(() => setPaused(false)).catch(() => setPaused(true));
    } else {
      el.pause();
      el.currentTime = 0;
      setProgress(0);
    }
  }, [active]);

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

  return (
    <section className="relative flex h-[calc(100svh-var(--header-h))] snap-start snap-always items-center justify-center bg-black">
      {/* Blurred backdrop fills the letterbox on wide screens */}
      {video.thumbnail_url && (
        <Image src={video.thumbnail_url} alt="" fill sizes="100vw" className="scale-110 object-cover opacity-25 blur-2xl" />
      )}

      <div className="relative h-full w-full max-w-[520px] overflow-hidden bg-black md:my-3 md:h-[calc(100%-1.5rem)] md:rounded-3xl">
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
          onTimeUpdate={(e) => {
            const v = e.currentTarget;
            if (v.duration) setProgress((v.currentTime / v.duration) * 100);
          }}
          className="h-full w-full cursor-pointer object-cover"
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
          className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
        >
          <Icon name={muted ? "volume_off" : "volume_up"} />
        </button>

        {muted && active && (
          <span className="pointer-events-none absolute right-16 top-6 rounded-full bg-black/60 px-3 py-1 text-badge-text font-bold text-white backdrop-blur-sm">
            Tap for sound
          </span>
        )}

        {/* Caption + shoppable card — extra bottom padding clears the mobile tab bar */}
        <div className="absolute inset-x-0 bottom-0 space-y-3 p-5 pb-24 md:pb-5">
          {video.category && (
            <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-badge-text font-bold uppercase tracking-wide text-white backdrop-blur-sm">
              {video.category}
            </span>
          )}
          <h2 className="text-xl font-extrabold leading-tight text-white">{video.title}</h2>
          {video.description && <p className="line-clamp-2 text-body-sm text-white/75">{video.description}</p>}

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

        {/* Scrub progress */}
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-white/20">
          <div className="h-full bg-white transition-[width] duration-200" style={{ width: `${progress}%` }} />
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
    <div className="relative bg-black">
      <div
        ref={containerRef}
        className="no-scrollbar h-[calc(100svh-var(--header-h))] snap-y snap-mandatory overflow-y-auto overscroll-y-contain"
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
