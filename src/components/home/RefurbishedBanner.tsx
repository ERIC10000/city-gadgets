import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { TrustpilotRating } from "@/components/home/Trustpilot";

const FEATURES = [
  { icon: "savings", label: "Savings up to 70% vs. retail" },
  { icon: "verified_user", label: "12-Month Warranty on every order" },
  { icon: "fact_check", label: "Quality-checked with full reports" },
  { icon: "cached", label: "Risk-free 30-Day Trial" },
  { icon: "local_shipping", label: "Fast, free same-day Nairobi delivery" },
];

export function RefurbishedBanner() {
  return (
    <section className="mx-auto w-full max-w-container-max px-margin-mobile py-12 md:px-gutter">
      <div className="mint-gradient grid grid-cols-1 gap-8 overflow-hidden rounded-3xl p-8 md:grid-cols-2 md:p-12">
        <div className="flex flex-col justify-center">
          <h2 className="text-2xl font-extrabold text-on-surface md:text-4xl">
            Premium Quality.
            <br />
            Trusted by thousands.
          </h2>
          <div className="mt-5">
            <TrustpilotRating />
          </div>
          <Link
            href="/shop"
            className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-on-surface px-7 py-3.5 text-body-sm font-bold text-white transition-transform hover:scale-[1.03]"
          >
            Shop all deals
            <Icon name="arrow_forward" className="text-[18px]" />
          </Link>
        </div>
        <ul className="flex flex-col justify-center gap-3 rounded-2xl bg-white/50 p-6 backdrop-blur-sm">
          {FEATURES.map((f) => (
            <li key={f.label} className="flex items-center gap-3 text-body-sm font-medium text-on-surface">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-secondary">
                <Icon name={f.icon} className="text-[18px]" />
              </span>
              {f.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
