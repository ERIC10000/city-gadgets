"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cart";

/** Forces the persisted cart to rehydrate from localStorage on first client mount. */
export function CartHydrator() {
  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);
  return null;
}
