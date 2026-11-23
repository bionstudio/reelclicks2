"use client";

import { useState } from "react";
import { CoverMedia } from "@/components/ui/CoverMedia";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import { useFinePointer } from "@/lib/hooks";
import type { PortfolioItem } from "@/lib/sanity/types";
import { videoSrc } from "@/lib/video";
import { cn } from "@/lib/utils";

type Props = {
  item: PortfolioItem;
  index: number;
  onOpen: (index: number) => void;
  className?: string;
  sizes?: string;
};

/** Portfolio tile: hover plays a muted preview (desktop), click/tap opens the lightbox. */
export function PortfolioCard({ item, index, onOpen, className, sizes = "(min-width: 768px) 50vw, 100vw" }: Props) {
  const fine = useFinePointer();
  const [hover, setHover] = useState(false);
  const preview = videoSrc(item.previewVideo) ?? videoSrc(item.video);
  const vertical = item.aspectRatio === "9:16";

  return (
    <article className={cn("group", className)}>
      <button
        type="button"
        data-cursor="play"
        onClick={() => onOpen(index)}
        onPointerEnter={() => fine && setHover(true)}
        onPointerLeave={() => setHover(false)}
        onFocus={() => fine && setHover(true)}
        onBlur={() => setHover(false)}
        aria-label={`Play “${item.title}” — ${item.category.title}`}
        className={cn(
          "relative block w-full overflow-hidden bg-charcoal",
          vertical ? "aspect-9/16" : "aspect-video",
        )}
      >
        <div className="absolute inset-0 transition-transform duration-[1.6s] ease-expo-out group-hover:scale-105">
          <CoverMedia image={item.thumbnail} alt={item.title} variant={index} sizes={sizes} />
          {preview && hover && (
            <VideoPlayer title={`${item.title} preview`} src={preview} background active={hover} lazy={false} />
          )}
        </div>
        <span aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-ink/70 via-transparent to-transparent opacity-80" />
        <span aria-hidden="true" className="label absolute top-4 left-4 text-ivory/80">{item.aspectRatio === "9:16" ? "Reel" : "Film"}</span>
        {/* Touch devices get a visible play badge */}
        <span
          aria-hidden="true"
          className="absolute right-4 bottom-4 flex h-11 w-11 items-center justify-center rounded-full border border-gold/60 text-gold backdrop-blur-sm lg:opacity-0 lg:transition-opacity lg:group-hover:opacity-100"
        >
          <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor">
            <path d="M0 0l12 7-12 7z" />
          </svg>
        </span>
      </button>
      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-2xl leading-tight font-light text-ivory md:text-3xl">{item.title}</h3>
          <p className="label mt-2 text-muted">
            {item.category.title}
            {item.location ? ` · ${item.location}` : ""}
          </p>
        </div>
      </div>
    </article>
  );
}
