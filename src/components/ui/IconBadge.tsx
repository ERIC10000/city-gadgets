import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

const TONE = {
  primary: "bg-primary-container/20 text-primary",
  secondary: "bg-secondary-container/40 text-secondary",
  gold: "bg-price-gold/10 text-price-gold",
  mpesa: "bg-m-pesa-green/10 text-m-pesa-green",
  whatsapp: "bg-whatsapp-green/10 text-whatsapp-green",
  tertiary: "bg-tertiary-container/30 text-tertiary",
} as const;

export function IconBadge({
  icon,
  tone = "primary",
  size = "md",
  className,
}: {
  icon: string;
  tone?: keyof typeof TONE;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClass = size === "lg" ? "h-14 w-14" : size === "sm" ? "h-9 w-9" : "h-12 w-12";
  return (
    <div className={cn("flex shrink-0 items-center justify-center rounded-xl", TONE[tone], sizeClass, className)}>
      <Icon name={icon} filled />
    </div>
  );
}
