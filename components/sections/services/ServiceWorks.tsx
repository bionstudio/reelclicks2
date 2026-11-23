"use client";

import { useState } from "react";
import type { PortfolioItem } from "@/lib/sanity/types";
import { cn } from "@/lib/utils";
import { PortfolioCard } from "@/components/portfolio/PortfolioCard";
import { PortfolioLightbox } from "@/components/portfolio/PortfolioLightbox";

/** 2–3 portfolio films for one service, with its own lightbox. */
export function ServiceWorks({ items }: { items: PortfolioItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  if (!items.length) return null;
  const [first, ...rest] = items;

  return (
    <div className="space-y-6">
      <PortfolioCard item={first} index={0} onOpen={setOpen} sizes="(min-width: 1024px) 40vw, 100vw" />
      {rest.length > 0 && (
        <div className={cn("grid gap-6", rest.length > 1 ? "grid-cols-2" : "grid-cols-1")}>
          {rest.map((item, i) => (
            <PortfolioCard key={item._id} item={item} index={i + 1} onOpen={setOpen} sizes="(min-width: 1024px) 20vw, 50vw" />
          ))}
        </div>
      )}
      <PortfolioLightbox items={items} index={open} onChange={setOpen} />
    </div>
  );
}
