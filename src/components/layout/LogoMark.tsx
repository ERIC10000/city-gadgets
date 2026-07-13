"use client";

import { motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";

export function LogoMark() {
  return (
    <motion.span
      whileHover={{ rotate: -8, scale: 1.08 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white"
    >
      <Icon name="bolt" filled />
    </motion.span>
  );
}
