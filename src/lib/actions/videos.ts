"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type VideoFormResult = { error?: string };

export async function createVideo(formData: FormData): Promise<VideoFormResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  const { error } = await supabase.from("product_videos").insert({
    vendor_id: user.id,
    product_id: String(formData.get("productId") ?? "") || null,
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    video_url: String(formData.get("videoUrl") ?? ""),
    thumbnail_url: String(formData.get("thumbnailUrl") ?? "") || null,
    duration_seconds: formData.get("durationSeconds") ? Number(formData.get("durationSeconds")) : null,
    category: String(formData.get("category") ?? "") || null,
  });

  if (error) return { error: error.message };

  revalidatePath("/vendor/videos");
  redirect("/vendor/videos");
}

export async function deleteVideo(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const supabase = await createClient();
  await supabase.from("product_videos").delete().eq("id", id);
  revalidatePath("/vendor/videos");
}
