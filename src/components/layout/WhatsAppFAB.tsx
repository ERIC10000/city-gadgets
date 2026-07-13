import Link from "next/link";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

export function WhatsAppFAB() {
  return (
    <Link
      href="https://wa.me/254700000000"
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed bottom-24 right-6 z-40 flex h-14 items-center gap-2 overflow-hidden rounded-full bg-whatsapp-green px-4 text-white shadow-card-lg transition-all hover:pr-5 md:bottom-8 md:right-8"
    >
      <WhatsAppIcon className="h-7 w-7 shrink-0" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-bold transition-all duration-300 group-hover:max-w-[160px]">
        Chat with us
      </span>
    </Link>
  );
}
