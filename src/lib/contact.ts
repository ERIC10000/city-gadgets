export const WHATSAPP_NUMBERS = [
  {
    raw: "254745575931",
    display: "0745 575 931",
    role: "Sales Executive",
    blurb: "Pricing, stock and orders",
  },
  {
    raw: "254794488806",
    display: "0794 488 806",
    role: "Customer Relations",
    blurb: "Warranty, returns and support",
  },
] as const;

// Used for every single-click WhatsApp deep link (FAB, quick-buy, checkout).
export const WHATSAPP_PRIMARY = WHATSAPP_NUMBERS[0].raw;

export function whatsappLink(message?: string, number: string = WHATSAPP_PRIMARY): string {
  return `https://wa.me/${number}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}

export const STORE_ADDRESS = {
  line1: "New Alnoor Exhibition, Shop 7",
  line2: "Second Floor, Taveta Road",
  line3: "Nairobi CBD",
  /** Single-line form for structured data and map links. */
  full: "New Alnoor Exhibition, Shop 7, Second Floor, Taveta Road, Nairobi CBD",
} as const;

export const STORE_EMAIL = "citygadgetskenya@gmail.com";

/**
 * Google Business Profile review link. This is the share link the owner
 * provided; it opens the profile where the "Write a review" button lives.
 * For a one-tap review dialog, swap in the direct link from the GBP dashboard
 * ("Ask for reviews" → the g.page/r/…/review URL).
 */
// Direct "write a review" deep link (Place ID: City Gadgets, Accra Rd, Nairobi)
// — lands the user straight on the review box instead of the profile page.
export const GOOGLE_REVIEW_URL = "https://search.google.com/local/writereview?placeid=ChIJz7oSFAARLxgRl0Z3G5aNws4";

/**
 * Official social profiles. Tracking parameters (utm_source, igsh, _t, _r)
 * are stripped — they belong to the share link that produced the URL, not to
 * the profile, and they would leak into the `sameAs` block Google reads.
 */
export const SOCIAL_LINKS = [
  {
    id: "instagram",
    label: "Instagram",
    handle: "@citygadgetskenya",
    href: "https://www.instagram.com/citygadgetskenya",
  },
  {
    id: "tiktok",
    label: "TikTok",
    handle: "@citygadgets_ke",
    href: "https://www.tiktok.com/@citygadgets_ke",
  },
  {
    id: "facebook",
    label: "Facebook",
    handle: "City Gadgets Kenya",
    // The numeric id is the profile itself, so this query string stays.
    href: "https://www.facebook.com/profile.php?id=61573338262561",
  },
] as const;

/**
 * Trading hours. `schemaDays` feeds schema.org OpeningHoursSpecification;
 * closed days are represented by omitting them from the spec entirely.
 */
export const OPENING_HOURS = [
  {
    label: "Mon – Fri",
    value: "9:00am – 7:00pm",
    open: true,
    schemaDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "09:00",
    closes: "19:00",
  },
  {
    label: "Saturday",
    value: "Closed",
    open: false,
    schemaDays: [],
    opens: null,
    closes: null,
  },
  {
    label: "Sunday",
    value: "11:00am – 4:00pm",
    open: true,
    schemaDays: ["Sunday"],
    opens: "11:00",
    closes: "16:00",
  },
] as const;
