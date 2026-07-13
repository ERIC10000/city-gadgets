import { cn } from "@/lib/utils";

/** Standardized WhatsApp glyph — the Stitch mockups mixed a raw SVG (product
 * pages) with the Material Symbol "chat" (listings/footer); we use this one
 * consistently everywhere so the brand mark never varies by page. */
export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cn("h-5 w-5", className)} aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.2h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.67c2.2 0 4.27.86 5.83 2.42a8.2 8.2 0 0 1 2.42 5.82c0 4.55-3.7 8.25-8.25 8.25a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.39c0-4.55 3.7-8.24 8.24-8.24Zm-3.6 4.28c-.17 0-.45.06-.68.32-.23.25-.9.87-.9 2.13 0 1.25.92 2.46 1.05 2.63.13.17 1.8 2.83 4.45 3.86.62.24 1.1.38 1.48.49.62.2 1.19.17 1.63.1.5-.07 1.53-.62 1.75-1.23s.22-1.12.15-1.23c-.07-.1-.24-.17-.5-.3s-1.53-.75-1.77-.84-.4-.13-.58.13-.67.84-.82 1.01c-.15.17-.3.19-.56.06s-1.1-.4-2.1-1.28c-.78-.68-1.3-1.53-1.46-1.79s-.02-.4.11-.53c.12-.12.27-.3.4-.46.13-.15.17-.26.26-.43.09-.17.04-.32-.02-.45s-.58-1.38-.79-1.9c-.21-.5-.42-.43-.58-.44Z" />
    </svg>
  );
}
