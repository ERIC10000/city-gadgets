import { ImageResponse } from "next/og";
import { getProductBySlug } from "@/lib/data/products";
import { formatKES } from "@/lib/format";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "City Gadgets product";

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  const name = product?.name ?? "City Gadgets";
  const price = product ? formatKES(product.price) : "";
  const brand = product?.brand ?? "City Gadgets";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #00629d 0%, #00a3ff 100%)",
          padding: 80,
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 36, fontWeight: 800 }}>
          <div
            style={{
              width: 56,
              height: 56,
              background: "white",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#00629d",
              fontSize: 40,
            }}
          >
            ⚡
          </div>
          City Gadgets
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontSize: 28, opacity: 0.85, textTransform: "uppercase", letterSpacing: 2 }}>{brand}</div>
          <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.1 }}>{name}</div>
          <div style={{ fontSize: 56, fontWeight: 800 }}>{price}</div>
        </div>
        <div style={{ fontSize: 26, opacity: 0.85 }}>Genuine tech · M-Pesa · Same-day Nairobi delivery</div>
      </div>
    ),
    { ...size },
  );
}
