import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/**
 * Guide artwork. Renders a real photo when one is supplied, sitting on top of
 * an on-brand themed gradient. The gradient (never an external asset) is the
 * base layer, so if the photo is slow or fails the hero still looks finished
 * rather than a broken/grey box. Pass `scrim` when text is overlaid on top.
 */
type Theme = { gradient: string; icon: string };

const THEME: Record<string, Theme> = {
  phones: { gradient: "linear-gradient(135deg,#1f6feb 0%,#3b2f9e 55%,#14141c 100%)", icon: "smartphone" },
  macbooks: { gradient: "linear-gradient(135deg,#4b5563 0%,#1f2937 55%,#0b0b12 100%)", icon: "laptop_mac" },
  tablets: { gradient: "linear-gradient(135deg,#0891b2 0%,#1e40af 55%,#14141c 100%)", icon: "tablet_mac" },
  consoles: { gradient: "linear-gradient(135deg,#7c3aed 0%,#4c1d95 55%,#14141c 100%)", icon: "sports_esports" },
  "gaming-accessories": { gradient: "linear-gradient(135deg,#7c3aed 0%,#4c1d95 55%,#14141c 100%)", icon: "stadia_controller" },
  audio: { gradient: "linear-gradient(135deg,#a21caf 0%,#6d28d9 55%,#14141c 100%)", icon: "headphones" },
  wearables: { gradient: "linear-gradient(135deg,#059669 0%,#155e75 55%,#14141c 100%)", icon: "watch" },
  cameras: { gradient: "linear-gradient(135deg,#d97706 0%,#7c2d12 55%,#14141c 100%)", icon: "photo_camera" },
  streaming: { gradient: "linear-gradient(135deg,#2563eb 0%,#312e81 55%,#14141c 100%)", icon: "cast" },
  accessories: { gradient: "linear-gradient(135deg,#0ea5e9 0%,#4338ca 55%,#14141c 100%)", icon: "cable" },
  default: { gradient: "linear-gradient(135deg,#1f6feb 0%,#6d28d9 55%,#14141c 100%)", icon: "devices" },
};

export function guideTheme(categorySlug: string): Theme {
  return THEME[categorySlug] ?? THEME.default;
}

export function GuideVisual({
  categorySlug,
  image,
  sizes = "(max-width: 768px) 100vw, 800px",
  className,
  showIcon = true,
  iconClassName = "text-[52px]",
  scrim = false,
  priority = false,
  children,
}: {
  categorySlug: string;
  image?: string;
  sizes?: string;
  className?: string;
  showIcon?: boolean;
  iconClassName?: string;
  scrim?: boolean;
  priority?: boolean;
  children?: React.ReactNode;
}) {
  const theme = guideTheme(categorySlug);
  return (
    <div className={cn("relative overflow-hidden", className)} style={{ background: theme.gradient }}>
      {image ? (
        <>
          <Image src={image} alt="" fill sizes={sizes} priority={priority} className="object-cover" />
          {scrim && (
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.4) 55%, rgba(0,0,0,0.15))" }}
            />
          )}
        </>
      ) : (
        <>
          {/* Fallback design — used only if no photo is supplied. */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(130% 90% at 85% 8%, rgba(255,255,255,0.22), transparent 55%)" }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
              backgroundSize: "26px 26px",
            }}
          />
          <Icon
            name={theme.icon}
            filled
            className="pointer-events-none absolute -bottom-8 -right-5 select-none text-[150px] leading-none text-white/10"
          />
          {showIcon && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Icon name={theme.icon} filled className={cn("text-white drop-shadow-lg", iconClassName)} />
            </div>
          )}
        </>
      )}
      {children}
    </div>
  );
}
