"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ReviewFormResult = { error?: string; ok?: boolean };

export async function submitReview(formData: FormData): Promise<ReviewFormResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Please sign in to leave a review." };

  const productId = String(formData.get("productId") ?? "");
  const slug = String(formData.get("slug") ?? "");
  const rating = Number(formData.get("rating") ?? 0);
  if (!productId) return { error: "Missing product." };
  if (!rating || rating < 1 || rating > 5) return { error: "Please choose a star rating." };

  const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle();
  const reviewerName = (profile as { full_name: string | null } | null)?.full_name ?? user.email?.split("@")[0] ?? "Verified buyer";

  // One review per customer per product — updates the existing one on resubmit.
  const { error } = await supabase.from("product_reviews").upsert(
    {
      product_id: productId,
      user_id: user.id,
      reviewer_name: reviewerName,
      rating,
      title: String(formData.get("title") ?? "").trim() || null,
      body: String(formData.get("body") ?? "").trim() || null,
    },
    { onConflict: "product_id,user_id" },
  );

  if (error) return { error: error.message };

  // The trigger has refreshed the product's aggregate rating; refresh the page
  // and anywhere the rating is shown.
  if (slug) revalidatePath(`/product/${slug}`);
  revalidatePath("/", "layout");
  return { ok: true };
}
