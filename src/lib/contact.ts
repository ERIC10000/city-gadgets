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
