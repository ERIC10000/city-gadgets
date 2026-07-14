"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";

export function SearchBar({ className = "" }: { className?: string }) {
  const [value, setValue] = useState("");
  const router = useRouter();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = value.trim();
    router.push(q ? `/shop?search=${encodeURIComponent(q)}` : "/shop");
  }

  return (
    <form
      onSubmit={submit}
      className={`flex items-center gap-2 rounded-xl border border-outline-variant bg-white px-4 py-2.5 transition-colors focus-within:border-on-surface ${className}`}
    >
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        type="search"
        placeholder="Search by model, color, brand..."
        aria-label="Search products"
        className="min-w-0 flex-1 bg-transparent text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none"
      />
      <button type="submit" aria-label="Search" className="text-on-surface-variant transition-colors hover:text-on-surface">
        <Icon name="search" className="text-[22px]" />
      </button>
    </form>
  );
}
