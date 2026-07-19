import Image from "next/image";
import { Icon } from "@/components/ui/Icon";

/**
 * Samsung.com-style department banner: clean light strip, brand mark top-left,
 * oversized centred title, product cut-outs flanking either side.
 */
export function CategoryBanner({
  title,
  tagline,
  images,
}: {
  title: string;
  tagline?: string | null;
  images: string[];
}) {
  const [left, right] = [images[0], images[1] ?? images[0]];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-surface-container">
      {/* Brand mark */}
      <div className="absolute left-6 top-5 z-10 flex items-center gap-1.5 md:left-10 md:top-7">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-on-surface text-white">
          <Icon name="bolt" filled className="text-[14px]" />
        </span>
        <span className="text-sm font-extrabold uppercase tracking-widest text-on-surface">City Gadgets</span>
      </div>

      <div className="grid min-h-[200px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 py-10 md:min-h-[260px] md:px-12">
        {/* Left product */}
        <div className="relative hidden h-36 md:block md:h-44">
          {left && <Image src={left} alt="" fill sizes="300px" className="object-contain object-left" />}
        </div>

        {/* Title */}
        <div className="col-span-3 text-center md:col-span-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface md:text-5xl">{title}</h1>
          {tagline && <p className="mx-auto mt-2 max-w-md text-body-sm text-on-surface-variant md:text-body-md">{tagline}</p>}
        </div>

        {/* Right product */}
        <div className="relative hidden h-36 md:block md:h-44">
          {right && <Image src={right} alt="" fill sizes="300px" className="object-contain object-right" />}
        </div>
      </div>
    </div>
  );
}
