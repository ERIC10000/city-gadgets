import { OPENING_HOURS, SOCIAL_LINKS, STORE_ADDRESS, STORE_EMAIL, WHATSAPP_NUMBERS } from "@/lib/contact";
import { toPlainText } from "@/components/ui/RichText";
import { formatKES } from "@/lib/format";
import type { Product } from "@/lib/types";

import { SITE_URL } from "@/lib/site";

const SITE_NAME = "City Gadgets";

/*
 * Search-intent copy. Kenyans type "<product> price in Kenya" and
 * "<category> price in Kenya", so we bake that phrasing — plus the real price,
 * warranty and local-delivery hooks that win the click — into every product
 * and category page's <title> and meta description. This is the single biggest
 * free SEO lever: the title tag is the strongest on-page ranking signal, and
 * the description drives click-through from the search result.
 */

/** e.g. "iPhone 15 Pro — Price in Kenya" (the template appends " | City Gadgets"). */
export function productMetaTitle(product: Product): string {
  return `${product.name} — Price in Kenya`;
}

/** Front-loaded with the product name, "in Kenya" and the live price. */
export function productMetaDescription(product: Product): string {
  const price = formatKES(product.price);
  const condition = product.condition === "refurbished" ? "certified refurbished" : "brand-new";
  const brand = product.brand ? `${product.brand} ` : "";
  return `Buy the ${product.name} in Kenya at ${price} — genuine ${brand}${condition} stock with a 12-month official brand warranty and fast same-day delivery within Nairobi.`;
}

export function categoryMetaTitle(name: string): string {
  return `${name} in Kenya — Best Prices`;
}

export function categoryMetaDescription(name: string): string {
  return `Shop ${name} in Kenya at City Gadgets — best prices on genuine stock, 12-month official brand warranty, M-Pesa payments and fast same-day delivery within Nairobi.`;
}

/**
 * Visible, data-driven intro paragraph for a category page. Real product
 * count, price range and brands make each one unique (not thin duplicate
 * copy) while repeating the "<category> in Kenya" phrasing search engines and
 * shoppers key on.
 */
export function categoryIntro(opts: {
  name: string;
  count: number;
  minPrice: number;
  maxPrice: number;
  brands: string[];
}): string {
  const range =
    opts.minPrice && opts.maxPrice && opts.maxPrice > opts.minPrice
      ? ` with prices from ${formatKES(opts.minPrice)} to ${formatKES(opts.maxPrice)}`
      : "";
  const brands = opts.brands.slice(0, 3);
  const brandLine = brands.length ? ` Top brands include ${brands.join(", ")}.` : "";
  return `Browse ${opts.count} ${opts.name.toLowerCase()} in Kenya at City Gadgets${range}.${brandLine} Every item is 100% genuine and backed by a 12-month official brand warranty — pay with M-Pesa or on delivery and enjoy fast same-day delivery within Nairobi.`;
}

/**
 * Buyer-question FAQ generated from the product's own data. Adds keyword-rich
 * on-page text (the product name paired with "price in Kenya", "available in
 * Kenya", "warranty", "delivery in Nairobi") and powers the FAQPage schema.
 */
export function productFaqs(product: Product): { q: string; a: string }[] {
  const price = formatKES(product.price);
  const wasClause =
    product.compare_at_price && product.compare_at_price > product.price
      ? `, down from ${formatKES(product.compare_at_price)}`
      : "";
  const condition = product.condition === "refurbished" ? "certified refurbished" : "brand-new";

  return [
    {
      q: `How much does the ${product.name} cost in Kenya?`,
      a: `The ${product.name} is priced at ${price}${wasClause} at City Gadgets. You can pay via M-Pesa, card or cash on delivery.`,
    },
    {
      q: `Is the ${product.name} available in Kenya?`,
      a:
        product.stock_quantity > 0
          ? `Yes — the ${product.name} is in stock at City Gadgets, ready for same-day delivery in Nairobi and countrywide shipping across Kenya.`
          : `The ${product.name} is currently out of stock. Message us on WhatsApp and we'll let you know the moment it's back.`,
    },
    {
      q: `Is the ${product.name} genuine and does it have a warranty?`,
      a: `Every ${product.name} we sell is 100% genuine ${condition} stock and comes with a 12-month official brand warranty.`,
    },
    {
      q: `Do you deliver the ${product.name} in Nairobi?`,
      a: `Yes. We offer fast same-day delivery within Nairobi and fast, affordable delivery to the rest of Kenya — order online or on WhatsApp.`,
    },
  ];
}

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/shop?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Store",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.jpeg`,
    image: `${SITE_URL}/logo.jpeg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${STORE_ADDRESS.line1}, ${STORE_ADDRESS.line2}`,
      addressLocality: "Nairobi",
      addressRegion: "Nairobi",
      addressCountry: "KE",
    },
    email: STORE_EMAIL,
    telephone: `+${WHATSAPP_NUMBERS[0].raw}`,
    // Closed days are omitted rather than listed with null hours.
    openingHoursSpecification: OPENING_HOURS.filter((h) => h.open).map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.schemaDays,
      opens: h.opens,
      closes: h.closes,
    })),
    sameAs: [
      ...SOCIAL_LINKS.map((s) => s.href),
      ...WHATSAPP_NUMBERS.map((n) => `https://wa.me/${n.raw}`),
    ],
  };
}

export function productJsonLd(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description ? toPlainText(product.description, 500) : undefined,
    brand: { "@type": "Brand", name: product.brand ?? SITE_NAME },
    image: product.images.map((img) => img.url),
    sku: product.id,
    aggregateRating:
      product.review_count > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.review_count,
          }
        : undefined,
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/product/${product.slug}`,
      priceCurrency: product.currency,
      price: product.price,
      availability:
        product.stock_quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition:
        product.condition === "new" ? "https://schema.org/NewCondition" : "https://schema.org/RefurbishedCondition",
    },
  };
}

/**
 * Marks a category page as a product collection and (optionally) lists its
 * items. Alongside the BreadcrumbList this is the structure Google reads when
 * deciding which category pages to surface as organic sitelinks.
 */
export function collectionPageJsonLd(opts: {
  name: string;
  description: string;
  path: string;
  products?: { slug: string; name: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${opts.name} | ${SITE_NAME}`,
    description: opts.description,
    url: `${SITE_URL}${opts.path}`,
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
    ...(opts.products?.length
      ? {
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: opts.products.length,
            itemListElement: opts.products.map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `${SITE_URL}/product/${p.slug}`,
              name: p.name,
            })),
          },
        }
      : {}),
  };
}

export function articleJsonLd(opts: {
  title: string;
  description: string;
  path: string;
  image: string;
  updatedAt: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.title,
    description: opts.description,
    image: opts.image,
    datePublished: opts.updatedAt,
    dateModified: opts.updatedAt,
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.jpeg` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}${opts.path}` },
  };
}

export function breadcrumbJsonLd(items: { name: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.href}`,
    })),
  };
}
