"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { RichText } from "@/components/ui/RichText";
import { cn } from "@/lib/utils";

const EXAMPLE = `Write a rich description with **Markdown**:

## Overview
A short paragraph about the product. Leave a blank line between paragraphs.

## Specifications
| Feature | Detail |
| --- | --- |
| Display | 6.9" OLED |
| Battery | 4700 mAh |

## What's in the box
- Device
- USB-C cable
- 12-month official brand warranty

## FAQ
**Is it brand new?**
Yes — sealed, with warranty.

**Do you deliver same-day?**
Yes, anywhere in Nairobi.`;

export function MarkdownField({
  name,
  defaultValue = "",
  className,
}: {
  name: string;
  defaultValue?: string;
  className?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const [mode, setMode] = useState<"write" | "preview">("write");

  const tab = (active: boolean) =>
    cn(
      "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-body-sm font-bold transition-colors",
      active ? "bg-on-surface text-white" : "text-on-surface-variant hover:bg-surface-container-high",
    );

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex gap-1">
          <button type="button" onClick={() => setMode("write")} className={tab(mode === "write")}>
            <Icon name="edit" className="text-[16px]" /> Write
          </button>
          <button type="button" onClick={() => setMode("preview")} className={tab(mode === "preview")}>
            <Icon name="visibility" className="text-[16px]" /> Preview
          </button>
        </div>
        <span className="flex items-center gap-1 text-badge-text text-on-surface-variant">
          <Icon name="info" className="text-[14px]" />
          Markdown: headings, tables, lists & FAQs
        </span>
      </div>

      {/* Textarea stays mounted (just hidden in preview) so the form still submits it */}
      <textarea
        name={name}
        rows={14}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={EXAMPLE}
        className={cn(className, "font-mono text-body-sm leading-relaxed", mode === "preview" && "hidden")}
      />

      {mode === "preview" && (
        <div className="min-h-[220px] rounded-xl border border-outline-variant bg-white p-4">
          {value.trim() ? (
            <RichText content={value} />
          ) : (
            <p className="text-body-sm text-on-surface-variant">Nothing to preview yet — switch to Write and add your description.</p>
          )}
        </div>
      )}

      {mode === "write" && !value.trim() && (
        <button
          type="button"
          onClick={() => setValue(EXAMPLE)}
          className="mt-2 text-badge-text font-semibold text-secondary hover:underline"
        >
          Insert a starter template
        </button>
      )}
    </div>
  );
}
