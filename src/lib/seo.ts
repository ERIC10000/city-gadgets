import { OPENING_HOURS, SOCIAL_LINKS, STORE_ADDRESS, STORE_EMAIL, WHATSAPP_NUMBERS } from "@/lib/contact";
import type { Product } from "@/lib/types";

import { SITE_URL } from "@/lib/site";

const SITE_NAME = "City Gadgets";

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
    logo: `${SITE_URL}/icon.png`,
    image: `${SITE_URL}/icon.png`,
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
    description: product.description,
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
