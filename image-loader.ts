type LoaderArgs = { src: string; width: number; quality?: number };

/**
 * Custom Next.js image loader — replaces Vercel's metered optimizer (which
 * returns 402 past the Hobby quota) without giving up optimization.
 *
 * Unsplash resizes and serves WebP on the fly via query params, so we hand it
 * the exact width Next requests — that also produces a proper responsive
 * srcset, so phones download small images instead of desktop-sized ones.
 *
 * Supabase Storage uploads and local /public assets are already web-sized and
 * are served as-is, keeping any third-party image proxy out of the critical
 * path.
 */
export default function imageLoader({ src, width, quality }: LoaderArgs): string {
  if (src.includes("images.unsplash.com")) {
    const [base] = src.split("?");
    const params = new URLSearchParams({
      w: String(width),
      q: String(quality ?? 70),
      auto: "format",
      fit: "crop",
    });
    return `${base}?${params.toString()}`;
  }
  return src;
}
