"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { formatKES } from "@/lib/format";
import { cn } from "@/lib/utils";

type Hit = {
  slug: string;
  name: string;
  brand: string | null;
  price: number;
  compareAtPrice: number | null;
  image: string | null;
  inStock: boolean;
};

export function SearchBar({ className = "" }: { className?: string }) {
  const [value, setValue] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [total, setTotal] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState(-1);
  const boxRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Debounced instant search.
  useEffect(() => {
    const q = value.trim();
    if (q.length < 2) {
      setHits([]);
      setTotal(0);
      return;
    }
    setLoading(true);
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: ctrl.signal });
        const data = await res.json();
        setHits(data.items ?? []);
        setTotal(data.total ?? 0);
        setCursor(-1);
      } catch {
        /* aborted or offline — keep previous hits */
      } finally {
        setLoading(false);
      }
    }, 180);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [value]);

  // Close on outside click.
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function goToSearchPage() {
    const q = value.trim();
    setOpen(false);
    router.push(q ? `/shop?search=${encodeURIComponent(q)}` : "/shop");
  }

  function openHit(hit: Hit) {
    setOpen(false);
    setValue("");
    router.push(`/product/${hit.slug}`);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open || hits.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => (c + 1) % hits.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => (c <= 0 ? hits.length - 1 : c - 1));
    } else if (e.key === "Enter" && cursor >= 0) {
      e.preventDefault();
      openHit(hits[cursor]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const showPanel = open && value.trim().length >= 2;

  return (
    <div ref={boxRef} className={cn("relative", className)}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          goToSearchPage();
        }}
        className="flex items-center gap-2 rounded-xl border border-outline-variant bg-white px-4 py-2.5 transition-colors focus-within:border-on-surface"
      >
        <input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          type="search"
          placeholder="Search by model, color, brand..."
          aria-label="Search products"
          className="min-w-0 flex-1 bg-transparent text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none"
        />
        <button type="submit" aria-label="Search" className="text-on-surface-variant transition-colors hover:text-on-surface">
          <Icon name={loading ? "progress_activity" : "search"} className={cn("text-[22px]", loading && "animate-spin")} />
        </button>
      </form>

      {showPanel && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-outline-variant bg-white shadow-card-lg">
          {hits.length === 0 && !loading ? (
            <div className="flex flex-col items-center gap-1 px-4 py-8 text-center">
              <Icon name="search_off" className="text-2xl text-on-surface-variant" />
              <p className="text-body-sm font-semibold text-on-surface">No products match “{value.trim()}”</p>
              <p className="text-badge-text text-on-surface-variant">Try a brand or model, e.g. “iPhone 17” or “Pixel”.</p>
            </div>
          ) : (
            <>
              <ul className="max-h-[60vh] overflow-y-auto py-2">
                {hits.map((hit, i) => (
                  <li key={hit.slug}>
                    <button
                      type="button"
                      onMouseEnter={() => setCursor(i)}
                      onClick={() => openHit(hit)}
                      className={cn(
                        "flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors",
                        i === cursor ? "bg-surface-container-high" : "hover:bg-surface-container-low",
                      )}
                    >
                      <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-outline-variant bg-white">
                        {hit.image && (
                          <Image src={hit.image} alt="" fill sizes="48px" className="object-contain p-1" />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="line-clamp-1 block text-body-sm font-semibold text-on-surface">{hit.name}</span>
                        <span className="text-badge-text text-on-surface-variant">
                          {hit.brand ?? ""}
                          {!hit.inStock && " · Sold out"}
                        </span>
                      </span>
                      <span className="shrink-0 text-body-sm font-extrabold text-on-surface">{formatKES(hit.price)}</span>
                    </button>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={goToSearchPage}
                className="flex w-full items-center justify-center gap-1.5 border-t border-outline-variant py-3 text-body-sm font-bold text-on-surface transition-colors hover:bg-surface-container-low"
              >
                See all {total} result{total === 1 ? "" : "s"}
                <Icon name="arrow_forward" className="text-[16px]" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
