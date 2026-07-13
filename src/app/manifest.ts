import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "City Gadgets",
    short_name: "City Gadgets",
    description: "Nairobi's premier destination for high-end electronics, gaming consoles, and lifestyle tech.",
    start_url: "/",
    display: "standalone",
    background_color: "#f9f9ff",
    theme_color: "#00629d",
    icons: [{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" }],
  };
}
