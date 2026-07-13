"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { Button, type ButtonProps } from "@/components/ui/Button";
import { useCartStore } from "@/store/cart";
import { cn } from "@/lib/utils";

type Status = "idle" | "adding" | "added";

export function AddToCartButton({
  productId,
  slug,
  name,
  price,
  image,
  disabled,
  className,
  variant = "secondary",
}: {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  disabled?: boolean;
  className?: string;
  variant?: ButtonProps["variant"];
}) {
  const add = useCartStore((s) => s.add);
  const [status, setStatus] = useState<Status>("idle");

  function handleClick() {
    if (status !== "idle") return;
    setStatus("adding");
    window.setTimeout(() => {
      add({ productId, slug, name, price, image });
      setStatus("added");
      window.setTimeout(() => setStatus("idle"), 1600);
    }, 450);
  }

  return (
    <Button
      type="button"
      variant={status === "added" ? "mpesa" : variant}
      disabled={disabled || status !== "idle"}
      onClick={handleClick}
      className={cn("relative overflow-hidden", className)}
    >
      <AnimatePresence mode="wait" initial={false}>
        {status === "idle" && (
          <motion.span
            key="idle"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex items-center gap-2"
          >
            <Icon name="add_shopping_cart" />
            {disabled ? "Out of Stock" : "Add to Cart"}
          </motion.span>
        )}
        {status === "adding" && (
          <motion.span
            key="adding"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex items-center gap-2"
          >
            <Icon name="progress_activity" className="animate-spin" />
            Adding…
          </motion.span>
        )}
        {status === "added" && (
          <motion.span
            key="added"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex items-center gap-2"
          >
            <Icon name="check_circle" filled />
            Added!
          </motion.span>
        )}
      </AnimatePresence>
    </Button>
  );
}
