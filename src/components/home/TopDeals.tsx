"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
      const h = Math.floor(diff / 3.6e6);
      const m = Math.floor((diff % 3.6e6) / 6e4);
      const s = Math.floor((diff % 6e4) / 1000);
      const pad = (n: number) => String(n).padStart(2, "0");
      setT({ h: pad(h), m: pad(m), s: pad(s) });
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
        <h2 className="mb-6 text-xl font-extrabold text-on-surface md:text-2xl">Today&apos;s Top Deals</h2>
        <div className="no-scrollbar scrollbar-thin -mx-1 flex gap-4 overflow-x-auto px-1 pb-2">
          <div className="flex w-[240px] shrink-0 flex-col justify-between rounded-2xl bg-inverse-surface p-6 text-white">
            <div>
              <span className="inline-block rounded-full bg-discount px-3 py-1 text-badge-text font-bold uppercase">
                Save up to 70%
              </span>
              <h3 className="mt-4 text-2xl font-extrabold">Today&apos;s Deals</h3>
              <p className="mt-1 text-body-sm text-white/60">Flash prices, refreshed daily.</p>
            </div>
            <div>
              <div className="my-4 flex gap-2">
                {[t.h, t.m, t.s].map((v, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/10 font-mono text-lg font-bold tabular-nums">
                      {v}
                    </span>
                    <span className="mt-1 text-[10px] uppercase text-white/50">{["Hrs", "Min", "Sec"][i]}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/deals"
                className="inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-2.5 text-body-sm font-bold text-on-surface transition-transform hover:scale-[1.02]"
              >
                Shop deals
              </Link>
            </div>
          </div>

          {products.map((p) => (
            <div key={p.id} className="w-[220px] shrink-0">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
