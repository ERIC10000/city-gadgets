import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export function Breadcrumbs({ items }: { items: { name: string; href?: string }[] }) {
  return (
    <nav className="flex flex-wrap items-center gap-1 text-body-sm text-on-surface-variant" aria-label="Breadcrumb">
      {items.map((item, i) => (
        <span key={item.name} className="flex items-center gap-1">
          {i > 0 && <Icon name="chevron_right" className="text-[16px]" />}
          {item.href ? (
            <Link href={item.href} className="hover:text-primary">
              {item.name}
            </Link>
          ) : (
            <span className="font-semibold text-on-surface">{item.name}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
