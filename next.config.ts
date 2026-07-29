import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve images straight from the source (Supabase Storage / Unsplash) rather
    // than through Vercel's image optimizer. The optimizer is metered on the
    // Hobby plan and returns 402 (OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED) once
    // the monthly quota is hit, which silently breaks every newly-uploaded
    // product photo. Unoptimized delivery has no such cap; the <Image> layout
    // behaviour (fill, sizing, lazy-loading) still works. Uploads are already
    // web-sized, so the transfer cost is negligible.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
  },
};

export default nextConfig;
