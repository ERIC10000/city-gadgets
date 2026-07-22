"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { formatKES } from "@/lib/format";
import type { ShoppableVideo } from "@/lib/data/videos";

/**
 * Homepage video teaser. Each tile silently plays a preview on hover (desktop)
 * and links through to the full-screen reels feed.
 */
function VideoTile({ video }: { video: ShoppableVideo }) {
  const ref = useRef<HTMLVideoElement>(null);

  return (
    <Link
      href="/inspiration"
      onMouseEnter={() => ref.current?.play().catch(() => {})}
      onMouseLeave={() => {
        const v = ref.current;
        if (v) {
          v.pause();
          v.currentTime = 0;
        }
      }}
      className="group relative aspect-[9/14] w-[190px] shrink-0 overflow-hidden rounded-2xl bg-inverse-surface md:w-full"
    >
      {video.thumbnail_url && (
        <Image
          src={video.thumbnail_url}
          alt={video.title}
          fill
          sizes="(max-width:768px) 190px, 20vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        ref={ref}
        src={video.video_url}
        muted
        loop
        playsInline
        preload="none"
        className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />

      <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
        <Icon name="play_circle" filled className="text-[13px]" />
        Watch
      </span>

      <div className="absolute inset-x-0 bottom-0 p-3">
        <p className="line-clamp-2 text-badge-text font-bold leading-snug text-white">{video.title}</p>
        {video.product && (
          <p className="mt-1 line-clamp-1 text-[11px] text-white/80">
            {video.product.name} · <span className="font-bold">{formatKES(video.product.price)}</span>
          </p>
        )}
      </div>
    </Link>
  );
}

export function CircularEconomy({ videos }: { videos: ShoppableVideo[] }) {
  if (!videos.length) return null;

  return (
    <section className="bg-inverse-surface py-14 text-white">
      <div className="mx-auto w-full max-w-container-max px-margin-mobile md:px-gutter">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-xl font-extrabold md:text-2xl">
            See it in action <span className="text-price-gold">·</span> Video Inspiration
          </h2>
          <Link
            href="/inspiration"
            className="flex items-center gap-1 text-body-sm font-semibold text-white/80 hover:text-price-gold"
          >
            Watch all <Icon name="chevron_right" className="text-[18px]" />
          </Link>
        </div>
        <p className="mb-6 max-w-2xl text-body-sm text-white/60">
          Real unboxings and hands-on demos from our Nairobi shop floor — tap any clip to watch full screen and shop
          straight from the video.
        </p>

        <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-5 md:overflow-visible">
          {videos.slice(0, 5).map((v) => (
            <VideoTile key={v.id} video={v} />
          ))}
        </div>
      </div>
    </section>
  );
}
