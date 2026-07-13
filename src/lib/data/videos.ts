import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { ProductVideo } from "@/lib/types";

// Curated placeholder showcase reel until vendors upload real "video
// inspiration" clips through the CMS. Video files are freely-licensed
// Google-hosted sample MP4s commonly used for player demos.
const SEED_VIDEOS: ProductVideo[] = [
  {
    id: "vid-quest3-reveal",
    vendor_id: null,
    product_id: null,
    title: "Meta Quest 3: Mixed Reality in 60 Seconds",
    description: "See how passthrough MR turns your living room into the arena.",
    video_url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    thumbnail_url:
      "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=1200&q=80&auto=format&fit=crop",
    duration_seconds: 58,
    category: "Gaming",
    view_count: 18400,
    created_at: new Date("2026-06-01").toISOString(),
  },
  {
    id: "vid-macbook-m5",
    vendor_id: null,
    product_id: null,
    title: "MacBook Pro M5: Unboxing & First Boot",
    description: "The 24GB/1TB M5 Pro chip build, straight out of the box.",
    video_url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    thumbnail_url:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=80&auto=format&fit=crop",
    duration_seconds: 132,
    category: "Laptops",
    view_count: 9800,
    created_at: new Date("2026-05-20").toISOString(),
  },
  {
    id: "vid-gopro13",
    vendor_id: null,
    product_id: null,
    title: "GoPro Hero 13: Boda Boda POV Ride",
    description: "HyperSmooth stabilization tested on Nairobi's roughest routes.",
    video_url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    thumbnail_url:
      "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=1200&q=80&auto=format&fit=crop",
    duration_seconds: 74,
    category: "Cameras",
    view_count: 22100,
    created_at: new Date("2026-06-10").toISOString(),
  },
  {
    id: "vid-watch-ultra3",
    vendor_id: null,
    product_id: null,
    title: "Apple Watch Ultra 3: 36-Hour Battery Test",
    description: "A full day of GPS training, calls, and always-on display.",
    video_url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    thumbnail_url:
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=1200&q=80&auto=format&fit=crop",
    duration_seconds: 96,
    category: "Wearables",
    view_count: 6400,
    created_at: new Date("2026-04-28").toISOString(),
  },
];

export async function getVideos(): Promise<ProductVideo[]> {
  if (!isSupabaseConfigured()) return SEED_VIDEOS;

  const supabase = await createClient();
  const { data, error } = await supabase.from("product_videos").select("*").order("created_at", { ascending: false });
  if (error || !data) return SEED_VIDEOS;
  return data as ProductVideo[];
}
