import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { WHATSAPP_NUMBERS, whatsappLink } from "@/lib/contact";

export function Footer() {
  return (
    <footer className="bg-inverse-surface pb-24 pt-16 text-inverse-on-surface md:pb-16">
      <div className="mx-auto w-full max-w-container-max px-margin-mobile md:px-gutter">
        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded bg-primary text-white">
                <Icon name="bolt" filled className="text-[20px]" />
              </span>
              <span className="text-xl font-extrabold tracking-tight text-white">City Gadgets</span>
            </div>
            <p className="leading-relaxed text-inverse-on-surface/70">
              Nairobi&apos;s premier destination for high-end electronics, gaming consoles, and innovative
              lifestyle tech. Precision-engineered for your digital life.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href={whatsappLink()}
                target="_blank"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition-all hover:border-whatsapp-green hover:bg-whatsapp-green"
              >
                <WhatsAppIcon />
              </Link>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition-all hover:border-primary hover:bg-primary"
              >
                <Icon name="alternate_email" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition-all hover:border-primary hover:bg-primary"
              >
                <Icon name="photo_camera" />
              </a>
            </div>
          </div>

          <div>
            <h5 className="mb-6 text-sm font-bold uppercase tracking-wider text-white">Quick Links</h5>
            <ul className="space-y-4 text-inverse-on-surface/70">
              <li><Link href="/shop" className="transition-colors hover:text-primary">Latest Releases</Link></li>
              <li><Link href="/category/consoles" className="transition-colors hover:text-primary">Gaming Gear</Link></li>
              <li><Link href="/category/wearables" className="transition-colors hover:text-primary">Wearables</Link></li>
              <li><Link href="/inspiration" className="transition-colors hover:text-primary">Video Inspiration</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="mb-6 text-sm font-bold uppercase tracking-wider text-white">Customer Care</h5>
            <ul className="space-y-4 text-inverse-on-surface/70">
              <li><Link href="/account/orders" className="transition-colors hover:text-primary">Track Your Order</Link></li>
              <li><Link href="#" className="transition-colors hover:text-primary">Returns &amp; Warranty</Link></li>
              <li><Link href="#" className="transition-colors hover:text-primary">Shipping Policy</Link></li>
              <li>
                <Link href={whatsappLink()} target="_blank" className="transition-colors hover:text-primary">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="mb-6 text-sm font-bold uppercase tracking-wider text-white">Find Us</h5>
            <div className="space-y-4 text-inverse-on-surface/70">
              <div className="flex items-start gap-3">
                <Icon name="location_on" className="text-primary" />
                <span>Gadget Plaza, 2nd Floor<br />Nairobi, CBD</span>
              </div>
              <div className="flex items-start gap-3">
                <WhatsAppIcon className="mt-0.5 h-5 w-5 text-whatsapp-green" />
                <div className="flex flex-col gap-1">
                  {WHATSAPP_NUMBERS.map((n) => (
                    <Link
                      key={n.raw}
                      href={whatsappLink("Hi City Gadgets!", n.raw)}
                      target="_blank"
                      className="transition-colors hover:text-primary"
                    >
                      {n.display}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Icon name="mail" className="text-primary" />
                <span>sales@citygadgets.co.ke</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-body-sm text-inverse-on-surface/70 md:flex-row">
          <p>© {new Date().getFullYear()} City Gadgets Limited. All rights reserved.</p>
          <div className="flex items-center gap-8">
            <a href="#" className="transition-colors hover:text-white">Privacy Policy</a>
            <a href="#" className="transition-colors hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
