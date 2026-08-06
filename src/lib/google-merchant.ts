import type { Product } from "@/lib/types";
import { SITE_URL, absoluteUrl } from "@/lib/site";
import { toPlainText } from "@/components/ui/RichText";

/**
 * Google Merchant Center product feed (RSS 2.0 + `g:` product namespace).
 *
 * Merchant Center pulls this URL on a schedule; each <item> becomes a product
 * eligible for free Shopping listings and Shopping ads. Spec:
 * https://support.google.com/merchants/answer/7052112
 *
 * Only published products with at least one image are emitted (image_link is a
 * required attribute — an item without one is rejected).
 */

/** Store category slug → Google product taxonomy ID (numeric IDs never mismatch). */
const GOOGLE_CATEGORY: Record<string, number> = {
  phones: 267, //           Electronics > Communications > Telephony > Mobile Phones
  macbooks: 328, //         Electronics > Computers > Laptops
  tablets: 4745, //         Electronics > Computers > Tablet Computers
  consoles: 1505, //        Electronics > Video Game Consoles
  "gaming-accessories": 232, // Electronics > Electronics Accessories
  audio: 223, //            Electronics > Audio
  cameras: 152, //          Cameras & Optics > Cameras
  wearables: 201, //        Apparel & Accessories > Jewelry > Watches
  streaming: 222, //        Electronics
  accessories: 232, //      Electronics > Electronics Accessories
};

const GTIN_KEYS = new Set(["gtin", "ean", "upc", "barcode", "isbn", "gtin13", "gtin12"]);

/** Escape a value for use inside an XML text node or attribute. */
function xml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Product images may be stored relative; Google requires absolute URLs. */
function absImage(url: string): string {
  return /^https?:\/\//.test(url) ? url : absoluteUrl(url);
}

/** Pull a GTIN/EAN/UPC out of the spec sheet if the vendor recorded one. */
function findGtin(specs: Record<string, string>): string | null {
  for (const [key, raw] of Object.entries(specs ?? {})) {
    if (!GTIN_KEYS.has(key.toLowerCase().trim())) continue;
    const digits = raw.replace(/\D/g, "");
    if (/^\d{8,14}$/.test(digits)) return digits;
  }
  return null;
}

function itemXml(product: Product, productType: string): string {
  const currency = product.currency || "KES";
  const link = absoluteUrl(`/product/${product.slug}`);
  const image = absImage(product.images[0].url);
  const additional = product.images
    .slice(1, 11) // Google allows up to 10 extra images
    .map((img) => `    <g:additional_image_link>${xml(absImage(img.url))}</g:additional_image_link>`)
    .join("\n");

  // In this store `price` is the current selling price and `compare_at_price`
  // is the higher "was" price when discounted. Google wants the regular price
  // in g:price and the discounted price in g:sale_price.
  const onSale = product.compare_at_price != null && product.compare_at_price > product.price;
  const regular = onSale ? product.compare_at_price! : product.price;
  const priceLines = onSale
    ? `    <g:price>${regular.toFixed(2)} ${currency}</g:price>\n    <g:sale_price>${product.price.toFixed(2)} ${currency}</g:sale_price>`
    : `    <g:price>${product.price.toFixed(2)} ${currency}</g:price>`;

  const availability = product.stock_quantity > 0 ? "in_stock" : "out_of_stock";
  const condition = product.condition === "refurbished" ? "refurbished" : "new";
  const title = product.name.length > 150 ? `${product.name.slice(0, 149)}…` : product.name;
  const description =
    (product.description ? toPlainText(product.description, 4900) : "") ||
    `${product.name}${product.brand ? ` by ${product.brand}` : ""} — ${
      condition === "refurbished" ? "certified refurbished" : "brand new"
    }, in stock at City Gadgets Kenya with fast Nairobi delivery.`;

  const gtin = findGtin(product.specs);
  const googleCategory = GOOGLE_CATEGORY[product.category_slug] ?? 222;

  return [
    `  <item>`,
    `    <g:id>${xml(product.id)}</g:id>`,
    `    <g:title>${xml(title)}</g:title>`,
    `    <g:description>${xml(description)}</g:description>`,
    `    <g:link>${xml(link)}</g:link>`,
    `    <g:image_link>${xml(image)}</g:image_link>`,
    additional,
    `    <g:availability>${availability}</g:availability>`,
    priceLines,
    `    <g:condition>${condition}</g:condition>`,
    product.brand ? `    <g:brand>${xml(product.brand)}</g:brand>` : "",
    // Provide a real GTIN when we have one, otherwise tell Google none exists so
    // the item isn't rejected for a missing unique product identifier.
    gtin ? `    <g:gtin>${gtin}</g:gtin>` : `    <g:identifier_exists>no</g:identifier_exists>`,
    `    <g:google_product_category>${googleCategory}</g:google_product_category>`,
    `    <g:product_type>${xml(productType)}</g:product_type>`,
    `    <g:shipping>`,
    `      <g:country>KE</g:country>`,
    `      <g:price>0.00 ${currency}</g:price>`,
    `    </g:shipping>`,
    `  </item>`,
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildGoogleMerchantFeed(products: Product[], categoryNames: Record<string, string>): string {
  const items = products
    .filter((p) => p.images.length > 0)
    .map((p) => itemXml(p, categoryNames[p.category_slug] ?? "Electronics"))
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>City Gadgets Kenya</title>
    <link>${SITE_URL}</link>
    <description>Genuine phones, laptops, gaming gear, audio and accessories — sourced in Nairobi with fast local delivery.</description>
${items}
  </channel>
</rss>`;
}
