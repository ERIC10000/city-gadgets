"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/lib/types";

function useCountdown() {
  const [t, setT] = useState({ h: "00", m: "00", s: "00" });
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const end = new Date(now);
      end.setHours(24, 0, 0, 0);
      const diff = Math.max(0, end.getTime() - now.getTime());
      const pad = (n: number) => String(n).padStart(2, "0");
      setT({
        h: pad(Math.floor(diff / 3.6e6)),
        m: pad(Math.floor((diff % 3.6e6) / 6e4)),
        s: pad(Math.floor((diff % 6e4) / 1000)),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

export function TopDeals({ products }: { products: Product[] }) {
  const t = useCountdown();
  if (!products.length) return null;

  return (
    <section className="py-12">
      <div className="mx-auto w-full max-w-container-max px-margin-mobile md:px-gutter">
        {/* Countdown banner strip */}
        <div className="mb-6 flex flex-col gap-4 rounded-2xl bg-inverse-surface px-6 py-5 text-white sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-discount">
              <Icon name="local_fire_department" filled />
            </span>
            <div>
              <h2 className="text-lg font-extrabold md:text-xl">Today&apos;s Top Deals</h2>
              <p className="text-body-sm text-white/60">Flash prices, refreshed daily.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex gap-1.5">
              {[t.h, t.m, t.s].map((v, i) => (
                <div key={i} className="flex flex-col items-center">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 font-mono text-body-sm font-bold tabular-nums">
                    {v}
                  </span>
                  <span className="mt-1 text-[9px] uppercase tracking-wide text-white/50">{["Hrs", "Min", "Sec"][i]}</span>
                </div>
              ))}
            </div>
            <Link
              href="/deals"
              className="shrink-0 rounded-full bg-white px-5 py-2.5 text-body-sm font-bold text-on-surface transition-transform hover:scale-[1.03]"
            >
              Shop all deals
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
