import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";

export type ProductReview = {
  id: string;
  product_id: string;
  user_id: string;
  reviewer_name: string | null;
  rating: number;
  title: string | null;
  body: string | null;
  created_at: string;
};

export async function getProductReviews(productId: string): Promise<ProductReview[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("product_reviews")
    .select("*")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data as ProductReview[];
}

/** The current user's own review of a product, if any (to pre-fill the form). */
export async function getMyReview(productId: string): Promise<ProductReview | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("product_reviews")
    .select("*")
    .eq("product_id", productId)
    .eq("user_id", user.id)
    .maybeSingle();
  return (data as ProductReview) ?? null;
}
