"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link href={href} className="group relative py-2">
      <motion.span
        whileHover={{ y: -2 }}
        whileTap={{ y: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className={cn(
          "inline-block text-base font-bold tracking-tight transition-colors",
          active ? "text-primary" : "text-on-surface-variant group-hover:text-primary",
        )}
      >
        {label}
      </motion.span>
      <span
        className={cn(
          "absolute -bottom-1 left-0 h-[3px] rounded-full bg-primary transition-all duration-300 ease-out",
          active ? "w-full" : "w-0 group-hover:w-full",
        )}
      />
    </Link>
  );
}
