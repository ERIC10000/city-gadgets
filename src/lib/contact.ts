export const WHATSAPP_NUMBERS = [
  { raw: "254745575931", display: "0745 575 931" },
  { raw: "254794488806", display: "0794 488 806" },
] as const;

// Used for every single-click WhatsApp deep link (FAB, quick-buy, checkout).
export const WHATSAPP_PRIMARY = WHATSAPP_NUMBERS[0].raw;

export function whatsappLink(message?: string, number: string = WHATSAPP_PRIMARY): string {
  return `https://wa.me/${number}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}
