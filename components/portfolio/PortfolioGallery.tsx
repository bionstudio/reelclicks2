"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, LayoutGroup, MotionConfig, motion } from "motion/react";
import type { Category, PortfolioItem } from "@/lib/sanity/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { PortfolioCard } from "./PortfolioCard";
import { PortfolioLightbox } from "./PortfolioLightbox";

const PAGE = 9;
const ease = [0.16, 1, 0.3, 1] as const;

type Props = { items: PortfolioItem[]; categories: Category[] };

/**
 * Filterable editorial gallery. The active filter lives in `?category=` so it
 * can be shared. Before the URL is read (prerender), "All" is shown.
 */
export function PortfolioGallery(props: Props) {
  return (
    <Suspense fallback={<GalleryView {...props} active="all" />}>
      <GalleryWithParams {...props} />
    </Suspense>
  );
}

function GalleryWithParams(props: Props) {
  const params = useSearchParams();
  const requested = params.get("category");
  const active = props.categories.some((c) => c.slug === requested) ? requested! : "all";

  function select(slug: string) {
    // Native history calls stay in sync with useSearchParams (no server round trip).
    const url = slug === "all" ? window.location.pathname : `?category=${slug}`;
    window.history.replaceState(null, "", url);
  }

  return <GalleryView {...props} active={active} onSelect={select} />;
}

function GalleryView({
  items,
  categories,
  active,
  onSelect,
}: Props & { active: string; onSelect?: (slug: string) => void }) {
  const [limits, setLimits] = useState<Record<string, number>>({});
  const [open, setOpen] = useState<number | null>(null);

  const filtered = active === "all" ? items : items.filter((i) => i.category?.slug === active);
  const limit = limits[active] ?? PAGE;
  const shown = filtered.slice(0, limit);
  const count = (slug: string) => (slug === "all" ? items.length : items.filter((i) => i.category?.slug === slug).length);

  const filters = [{ slug: "all", title: "All" }, ...categories];

  return (
    <MotionConfig reducedMotion="user">
      <div className="sticky top-[69px] z-30 -mx-5 border-y border-hairline bg-ink/90 backdrop-blur-md md:-mx-10 xl:-mx-16">
        <LayoutGroup id="portfolio-filters">
          <ul
            role="list"
            aria-label="Filter portfolio by category"
            className="no-scrollbar flex gap-6 overflow-x-auto px-5 md:gap-10 md:px-10 xl:px-16"
          >
            {filters.map((f) => {
              const isActive = f.slug === active;
              return (
                <li key={f.slug} className="shrink-0">
                  <button
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => onSelect?.(f.slug)}
                    className={cn(
                      "label relative flex min-h-14 items-center gap-2 transition-colors duration-500",
                      isActive ? "text-ivory" : "text-muted hover:text-ivory",
                    )}
                  >
                    {f.title}
                    <sup className={cn("text-[0.55rem]", isActive ? "text-gold" : "text-muted/60")}>
                      {String(count(f.slug)).padStart(2, "0")}
                    </sup>
                    {isActive && (
                      <motion.span
                        layoutId="filter-underline"
                        className="absolute inset-x-0 -bottom-px h-px bg-gold"
                        transition={{ duration: 0.7, ease }}
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </LayoutGroup>
      </div>

      <div className="pt-14 md:pt-20">
        <h2 className="sr-only">{active === "all" ? "All films" : filters.find((f) => f.slug === active)?.title}</h2>
        {shown.length === 0 ? (
          <p className="py-32 text-center font-display text-3xl font-light text-muted italic">New films coming soon.</p>
        ) : (
          <motion.ul layout className="gap-6 sm:columns-2 md:gap-8 lg:columns-3">
            <AnimatePresence mode="popLayout" initial={false}>
              {shown.map((item, i) => (
                <motion.li
                  key={item._id}
                  layout
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.8, ease }}
                  className="mb-12 break-inside-avoid md:mb-16"
                >
                  <PortfolioCard
                    item={item}
                    index={i}
                    onOpen={setOpen}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        )}

        {shown.length < filtered.length && (
          <div className="mt-8 flex flex-col items-center gap-4">
            <p className="label text-muted">
              Showing {shown.length} of {filtered.length}
            </p>
            <Button variant="outline" onClick={() => setLimits((l) => ({ ...l, [active]: limit + PAGE }))}>
              Load more films
            </Button>
          </div>
        )}
      </div>

      <PortfolioLightbox items={filtered} index={open} onChange={setOpen} />
    </MotionConfig>
  );
}
