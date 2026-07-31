import type { Metadata } from "next";
import { InspirationFeed } from "@/components/inspiration/InspirationFeed";
import { getVideos } from "@/lib/data/videos";

import { canonical } from "@/lib/site";

export const metadata: Metadata = {
  title: "Video Inspiration",
  description: "Cinematic hands-on videos of the latest gaming consoles, cameras, and wearables — shot in Nairobi.",
  alternates: canonical("/inspiration"),
};

export default async function InspirationPage() {
  const videos = await getVideos();
  return <InspirationFeed videos={videos} />;
}
