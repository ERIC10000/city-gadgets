"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { formatDuration } from "@/lib/format";
import type { ProductVideo } from "@/lib/types";

function VideoModal({ video, onClose }: { video: ProductVideo; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        aria-label="Close video"
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
      >
        <Icon name="close" />
      </button>
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="w-full max-w-4xl overflow-hidden rounded-2xl bg-black"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video src={video.video_url} controls autoPlay className="aspect-video w-full" />
        <div className="p-4 text-white">
          <h3 className="font-bold">{video.title}</h3>
          <p className="text-body-sm text-white/70">{video.description}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function InspirationFeed({ videos }: { videos: ProductVideo[] }) {
  const [playing, setPlaying] = useState<ProductVideo | null>(null);
  const [featured, ...rest] = videos;

  return (
    <div className="bg-[#141b2b] text-white">
      {featured && (
        <section className="relative mx-auto max-w-container-max overflow-hidden px-margin-mobile py-8 md:px-gutter md:py-12">
          <button
            onClick={() => setPlaying(featured)}
            className="group relative block aspect-video w-full overflow-hidden rounded-3xl"
          >
            {featured.thumbnail_url && (
              <Image src={featured.thumbnail_url} alt={featured.title} fill sizes="100vw" className="object-cover" priority />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            <span className="absolute left-6 top-6 rounded-full bg-tertiary px-3 py-1 text-badge-text font-bold uppercase tracking-wide text-white">
              Featured Trailer
            </span>
            <span className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full glass-dark transition-transform group-hover:scale-110">
              <Icon name="play_arrow" filled className="text-4xl" />
            </span>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-left md:p-10">
              <h1 className="text-2xl font-extrabold md:text-4xl">{featured.title}</h1>
              <p className="mt-2 max-w-xl text-white/70">{featured.description}</p>
            </div>
          </button>
        </section>
      )}

      <section className="mx-auto max-w-container-max px-margin-mobile pb-16 md:px-gutter">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-2xl font-extrabold md:text-headline-lg">More Inspiration</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {rest.map((video) => (
            <button
              key={video.id}
              onClick={() => setPlaying(video)}
              className="group overflow-hidden rounded-2xl glass-dark text-left transition-transform hover:-translate-y-1"
            >
              <div className="relative h-56 w-full overflow-hidden">
                {video.thumbnail_url && (
                  <Image
                    src={video.thumbnail_url}
                    alt={video.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-black/30" />
                <span className="absolute bottom-3 right-3 rounded bg-black/70 px-2 py-1 text-badge-text font-semibold">
                  {formatDuration(video.duration_seconds)}
                </span>
                <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                  <Icon name="play_arrow" filled />
                </span>
              </div>
              <div className="p-5">
                <p className="text-badge-text font-semibold uppercase tracking-wide text-primary-fixed">
                  {video.category} · {formatDuration(video.duration_seconds)}
                </p>
                <h3 className="mt-1 line-clamp-2 font-bold">{video.title}</h3>
                <p className="mt-1 line-clamp-2 text-body-sm text-white/60">{video.description}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <AnimatePresence>{playing && <VideoModal video={playing} onClose={() => setPlaying(null)} />}</AnimatePresence>
    </div>
  );
}
