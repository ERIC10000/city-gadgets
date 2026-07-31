/**
 * The one place the storefront's public origin is decided.
 *
 * Background: `NEXT_PUBLIC_SITE_URL` used to be read separately in seo.ts,
 * sitemap.ts, robots.ts and layout.tsx, each falling back to the *apex*
 * domain. But the apex 308-redirects to `www`, so every sitemap entry, the
 * `Sitemap:` line in robots.txt and every URL inside our JSON-LD advertised a
 * redirecting host — 400+ needless hops and a muddy canonical signal.
 *
 * Rather than depend on the environment variable being set correctly in every
 * deployment, we normalise here: whatever is configured, the apex form is
 * rewritten to the canonical `www` host. Localhost and preview hosts are left
 * alone so local development and Vercel previews still resolve to themselves.
 */

/** The host search engines should see. */
export const CANONICAL_HOST = "www.citygadgetskenya.co.ke";

/** Redirected to CANONICAL_HOST at the edge; never emit URLs on this host. */
export const APEX_HOST = "citygadgetskenya.co.ke";

function normalise(raw: string): string {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return `https://${CANONICAL_HOST}`;
  }

  if (url.hostname === APEX_HOST) {
    url.hostname = CANONICAL_HOST;
    url.protocol = "https:";
    url.port = "";
  }

  // Trailing slash would double up in every `${SITE_URL}${path}` template.
  return url.toString().replace(/\/$/, "");
}

export const SITE_URL = normalise(
  process.env.NEXT_PUBLIC_SITE_URL ?? `https://${CANONICAL_HOST}`,
);

/**
 * Absolute URL for a site-relative path. Use for structured data and anywhere
 * else a fully-qualified URL is required.
 */
export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Canonical `alternates` block for a page's metadata.
 *
 * Always pass the clean, parameter-free path. Listing pages accept sort and
 * filter params, so without this a single category is reachable at an
 * unbounded number of URLs with nothing telling Google which one counts.
 *
 * Note this is deliberately set per-route rather than once on the root layout:
 * a canonical inherited from the layout would point every page at "/".
 */
export function canonical(path: string) {
  return { canonical: path } as const;
}
