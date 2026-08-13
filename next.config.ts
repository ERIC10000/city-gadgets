import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Custom loader (image-loader.ts) instead of Vercel's metered optimizer,
    // which 402s past the Hobby quota. Unsplash images get resized responsive
    // WebP for free; Supabase/local assets are served as-is. This restores
    // per-viewport image sizing (phones no longer download desktop-sized
    // images) that the previous `unoptimized: true` had disabled.
    loader: "custom",
    loaderFile: "./image-loader.ts",
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
  },
};

export default nextConfig;
