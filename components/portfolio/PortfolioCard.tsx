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
          "theme-dark relative block w-full overflow-hidden rounded-2xl bg-surface md:rounded-3xl",
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
        <span aria-hidden="true" className="label absolute top-4 left-4 rounded-full bg-black/50 px-3 py-1.5 text-paper backdrop-blur">{item.aspectRatio === "9:16" ? "● Reel" : "● Film"}</span>
        {/* Touch devices get a visible play badge */}
        <span
          aria-hidden="true"
          className="absolute right-4 bottom-4 flex h-12 w-12 items-center justify-center rounded-full bg-red text-black transition-transform duration-500 group-hover:scale-110"
        >
          <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor">
            <path d="M0 0l12 7-12 7z" />
          </svg>
        </span>
      </button>
      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-2xl leading-tight font-semibold text-paper md:text-3xl">{item.title}</h3>
          <p className="label mt-2 text-paper/60">
            {item.category.title}
            {item.location ? ` · ${item.location}` : ""}
          </p>
        </div>
      </div>
    </article>
  );
}
