import Image from "next/image";

export function HotDealsBanner({ images }: { images: string[] }) {
  return (
    <div className="deals-gradient relative overflow-hidden rounded-3xl px-8 py-10 md:px-12 md:py-14">
      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <span className="text-4xl md:text-5xl" aria-hidden>
            🔥
          </span>
          <h1 className="text-4xl font-extrabold uppercase italic tracking-tight text-white md:text-6xl">
            Hot Deals
          </h1>
        </div>
        <p className="mt-3 max-w-md text-body-md text-white/70">
          Limited-time markdowns on premium tech — up to 70% off retail while stock lasts.
        </p>
      </div>

      {/* Floating product shots */}
      <div className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 gap-4 md:flex">
        {images.slice(0, 4).map((src, i) => (
          <div
            key={src}
            className="relative h-24 w-24 overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm"
            style={{ transform: `translateY(${(i % 2 === 0 ? -1 : 1) * 16}px) rotate(${(i - 1.5) * 6}deg)` }}
          >
            <Image src={src} alt="" fill sizes="96px" className="object-contain p-2" />
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-discount/30 blur-3xl" />
    </div>
  );
}
