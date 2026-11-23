"use client";

import { useState } from "react";
import type { PortfolioItem } from "@/lib/sanity/types";
import { cn } from "@/lib/utils";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { RevealText } from "@/components/ui/RevealText";
import { RevealMedia } from "@/components/ui/RevealMedia";
import { Button } from "@/components/ui/Button";
import { PortfolioCard } from "@/components/portfolio/PortfolioCard";
import { PortfolioLightbox } from "@/components/portfolio/PortfolioLightbox";

/** Asymmetric editorial placement for up to 6 items (desktop). Mobile stacks. */
const LAYOUT = [
  { wide: "md:col-span-8", tall: "md:col-span-4" },
  { wide: "md:col-span-6 md:col-start-7 md:mt-40", tall: "md:col-span-3 md:col-start-10 md:mt-40" },
  { wide: "md:col-span-7 md:col-start-1", tall: "md:col-span-4 md:col-start-2" },
  { wide: "md:col-span-6 md:col-start-7 md:mt-24", tall: "md:col-span-3 md:col-start-8 md:mt-24" },
  { wide: "md:col-span-6 md:col-start-2", tall: "md:col-span-4 md:col-start-2" },
  { wide: "md:col-span-5 md:col-start-8 md:mt-32", tall: "md:col-span-3 md:col-start-9 md:mt-32" },
];

export function FeaturedWork({ items }: { items: PortfolioItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="container-cinema py-28 md:py-44" aria-labelledby="featured-title">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <SectionLabel>Featured Work</SectionLabel>
          <RevealText as="h2" className="mt-6 font-display text-[44px] leading-[0.95] font-light md:text-7xl xl:text-8xl">
            <span id="featured-title">
              Films that feel <em className="text-gold-soft">like memories.</em>
            </span>
          </RevealText>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-16 md:mt-24 md:grid-cols-12 md:gap-y-24">
        {items.slice(0, 6).map((item, i) => {
          const slot = LAYOUT[i % LAYOUT.length];
          return (
            <RevealMedia
              key={item._id}
              className={cn(item.aspectRatio === "9:16" ? slot.tall : slot.wide)}
              delay={(i % 2) * 0.1}
            >
              <PortfolioCard
                item={item}
                index={i}
                onOpen={setOpen}
                sizes={item.aspectRatio === "9:16" ? "(min-width: 768px) 30vw, 100vw" : "(min-width: 768px) 60vw, 100vw"}
              />
            </RevealMedia>
          );
        })}
      </div>

      <div className="mt-20 flex justify-center md:mt-28">
        <Button href="/portfolio" variant="outline" size="lg">
          View Full Portfolio
        </Button>
      </div>

      <PortfolioLightbox items={items} index={open} onChange={setOpen} />
    </section>
  );
}
