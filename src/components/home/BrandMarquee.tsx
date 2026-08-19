import { BRAND_LOGOS } from "./brand-logos";

/**
 * A professional, self-scrolling strip of the brands we actually stock — real
 * official logos, tinted to a single muted slate so they read as one coherent
 * trust signal (colour lifts subtly on hover). The track carries the logo list
 * twice and translates by -50%, so the loop is seamless with pure CSS (no JS).
 * See globals.css `.brand-marquee` for the animation and reduced-motion rules.
 */
export function BrandMarquee() {
  return (
    <section aria-label="Brands we stock" className="border-b border-outline-variant bg-white">
      <div className="mx-auto w-full max-w-container-max px-margin-mobile py-6 md:px-gutter md:py-7">
        <p className="mb-5 text-center text-badge-text font-bold uppercase tracking-[0.22em] text-on-surface-variant">
          Genuine stock from the brands you trust
        </p>

        <div className="brand-marquee group relative overflow-hidden">
          <div className="brand-marquee__track flex w-max items-center">
            {[0, 1].map((copy) => (
              <ul
                key={copy}
                data-marquee-clone={copy === 1}
                aria-hidden={copy === 1}
                className="flex shrink-0 items-center"
              >
                {BRAND_LOGOS.map((b) => (
                  <li key={`${copy}-${b.slug}`} className="mx-6 flex shrink-0 items-center md:mx-9">
                    <svg
                      viewBox={b.viewBox}
                      role="img"
                      aria-label={b.name}
                      fill="currentColor"
                      style={{ height: `calc(var(--brand-h) * ${b.scale})` }}
                      className="w-auto text-on-surface/40 transition-colors duration-300 group-hover:text-on-surface/70"
                      dangerouslySetInnerHTML={{ __html: b.inner }}
                    />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
