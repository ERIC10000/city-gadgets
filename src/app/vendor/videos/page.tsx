import type { Metadata } from "next";
import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { VideoForm } from "@/components/vendor/VideoForm";
import { formatDuration } from "@/lib/format";
import { getCurrentUser } from "@/lib/data/auth";
import { getVendorVideos } from "@/lib/data/vendor";
import { createVideo, deleteVideo } from "@/lib/actions/videos";

export const metadata: Metadata = { title: "Video Inspiration" };

export default async function VendorVideosPage() {
  const current = await getCurrentUser();
  if (!current) return null;

  const videos = await getVendorVideos(current.profile.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-on-surface md:text-headline-lg">Video Inspiration</h1>
        <p className="text-on-surface-variant">Upload short-form video showcases that appear on the Inspiration feed.</p>
      </div>

      {videos.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <div key={video.id} className="overflow-hidden rounded-2xl bg-surface-container-lowest shadow-card">
              <div className="relative h-40 w-full bg-inverse-surface">
                {video.thumbnail_url && (
                  <Image src={video.thumbnail_url} alt={video.title} fill sizes="33vw" className="object-cover" />
                )}
                <span className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-0.5 text-badge-text font-semibold text-white">
                  {formatDuration(video.duration_seconds)}
                </span>
              </div>
              <div className="p-4">
                <p className="line-clamp-1 font-bold text-on-surface">{video.title}</p>
                <p className="text-body-sm text-on-surface-variant">{video.category}</p>
                <form action={deleteVideo} className="mt-3">
                  <input type="hidden" name="id" value={video.id} />
                  <button type="submit" className="flex items-center gap-1 text-body-sm font-bold text-error hover:underline">
                    <Icon name="delete" className="text-[16px]" />
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-card">
        <h2 className="mb-4 font-bold text-on-surface">Add New Video</h2>
        <VideoForm action={createVideo} />
      </div>
    </div>
  );
}
