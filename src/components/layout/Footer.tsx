import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { WHATSAPP_NUMBERS, whatsappLink } from "@/lib/contact";

export function Footer() {
  return (
    <footer className="bg-inverse-surface pb-24 text-inverse-on-surface md:pb-16">
      {/* Gold signature strip */}
      <div className="h-1 w-full bg-gradient-to-r from-price-gold/20 via-price-gold to-price-gold/20" />

      <div className="mx-auto w-full max-w-container-max px-margin-mobile pt-16 md:px-gutter">
        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-price-gold text-inverse-surface">
                <Icon name="bolt" filled className="text-[20px]" />
              </span>
              <span className="text-xl font-extrabold tracking-tight text-white">
                City <span className="text-price-gold">Gadgets</span>
              </span>
            </div>
            <p className="leading-relaxed text-inverse-on-surface/70">
              Nairobi&apos;s premier destination for high-end electronics, gaming consoles, and innovative
              lifestyle tech. Precision-engineered for your digital life.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href={whatsappLink()}
                target="_blank"
                aria-label="WhatsApp"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-price-gold/40 text-price-gold transition-all hover:border-whatsapp-green hover:bg-whatsapp-green hover:text-white"
              >
                <WhatsAppIcon />
              </Link>
              <a
                href="#"
                aria-label="Email"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-price-gold/40 text-price-gold transition-all hover:bg-price-gold hover:text-inverse-surface"
              >
                <Icon name="alternate_email" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-price-gold/40 text-price-gold transition-all hover:bg-price-gold hover:text-inverse-surface"
              >
                <Icon name="photo_camera" />
              </a>
            </div>
          </div>

          <div>
            <h5 className="mb-6 text-sm font-bold uppercase tracking-wider text-price-gold">Quick Links</h5>
            <ul className="space-y-4 text-inverse-on-surface/70">
              <li><Link href="/deals" className="transition-colors hover:text-price-gold">Hot Deals</Link></li>
              <li><Link href="/shop" className="transition-colors hover:text-price-gold">Latest Releases</Link></li>
              <li><Link href="/category/consoles" className="transition-colors hover:text-price-gold">Gaming Gear</Link></li>
              <li><Link href="/sell" className="transition-colors hover:text-price-gold">Sell Your Device</Link></li>
              <li><Link href="/inspiration" className="transition-colors hover:text-price-gold">Video Inspiration</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="mb-6 text-sm font-bold uppercase tracking-wider text-price-gold">Customer Care</h5>
            <ul className="space-y-4 text-inverse-on-surface/70">
              <li><Link href="/account/orders" className="transition-colors hover:text-price-gold">Track Your Order</Link></li>
              <li><Link href="#" className="transition-colors hover:text-price-gold">Returns &amp; Warranty</Link></li>
              <li><Link href="#" className="transition-colors hover:text-price-gold">Shipping Policy</Link></li>
              <li>
                <Link href={whatsappLink()} target="_blank" className="transition-colors hover:text-price-gold">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="mb-6 text-sm font-bold uppercase tracking-wider text-price-gold">Find Us</h5>
            <div className="space-y-4 text-inverse-on-surface/70">
              <div className="flex items-start gap-3">
                <Icon name="location_on" className="text-price-gold" />
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
                      className="transition-colors hover:text-price-gold"
                    >
                      {n.display}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Icon name="mail" className="text-price-gold" />
                <span>sales@citygadgets.co.ke</span>
              </div>
              <div className="flex items-center gap-3">
                <Icon name="schedule" className="text-price-gold" />
                <span>Mon–Sat · 9:00am – 7:00pm</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-price-gold/20 pt-8 text-body-sm text-inverse-on-surface/70 md:flex-row">
          <p>
            © {new Date().getFullYear()} <span className="font-semibold text-price-gold">City Gadgets Limited</span>. All
            rights reserved.
          </p>
          <div className="flex items-center gap-8">
            <a href="#" className="transition-colors hover:text-price-gold">Privacy Policy</a>
            <a href="#" className="transition-colors hover:text-price-gold">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
