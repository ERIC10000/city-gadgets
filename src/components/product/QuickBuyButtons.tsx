"use client";

import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { formatKES } from "@/lib/format";
import { useCartStore } from "@/store/cart";

export function QuickBuyButtons({
  productId,
  slug,
  name,
  price,
  image,
  disabled,
}: {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  disabled?: boolean;
}) {
  const router = useRouter();
  const add = useCartStore((s) => s.add);

  function buyWithMpesa() {
    add({ productId, slug, name, price, image });
    router.push("/checkout");
  }

  const whatsappHref = `https://wa.me/254700000000?text=${encodeURIComponent(
    `Hi! I'm interested in the ${name} (${formatKES(price)}). Is it in stock?`,
  )}`;

  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={buyWithMpesa}
        disabled={disabled}
        className="flex h-12 items-center justify-center gap-2 rounded-xl bg-m-pesa-green font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Icon name="payments" />
        M-Pesa
      </button>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-12 items-center justify-center gap-2 rounded-xl bg-whatsapp-green font-bold text-white transition-opacity hover:opacity-90"
      >
        <WhatsAppIcon className="h-5 w-5" />
        WhatsApp
      </a>
    </div>
  );
}
