import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

export function MenuRow({
  href,
  icon,
  label,
  tone = "default",
  className,
}: {
  href: string;
  icon: string;
  label: string;
  tone?: "default" | "danger";
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-4 rounded-xl bg-surface-container-lowest p-4 shadow-card transition-transform active:scale-[0.98]",
        className,
      )}
    >
      <span
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-lg",
          tone === "danger" ? "bg-error-container text-error" : "bg-surface-container-high text-primary",
        )}
      >
        <Icon name={icon} />
      </span>
      <span className={cn("flex-1 font-bold", tone === "danger" ? "text-error" : "text-on-surface")}>{label}</span>
      {tone !== "danger" && <Icon name="chevron_right" className="text-on-surface-variant" />}
    </Link>
  );
}
