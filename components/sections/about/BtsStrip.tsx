"use client";

import { useRef, type PointerEvent } from "react";
import type { SanityImage } from "@/lib/sanity/types";
import { CoverMedia } from "@/components/ui/CoverMedia";
import { SectionLabel } from "@/components/ui/SectionLabel";

const CAPTIONS = ["On set", "Golden hour", "Drone check", "Lighting", "The edit", "Rehearsal", "Wedding day", "Colour grade"];

/**
 * Behind-the-scenes strip. Native horizontal scrolling (touch, trackpad, keyboard)
 * plus click-and-drag with the mouse on desktop.
 */
export function BtsStrip({ images }: { images: SanityImage[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);

  const tiles = images.length ? images : Array.from({ length: 8 }, () => null);

  function onDown(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse" || !ref.current) return;
    drag.current = { x: e.clientX, left: ref.current.scrollLeft, moved: false };
    ref.current.setPointerCapture(e.pointerId);
  }
  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (!drag.current || !ref.current) return;
    const dx = e.clientX - drag.current.x;
    if (Math.abs(dx) > 3) drag.current.moved = true;
    ref.current.scrollLeft = drag.current.left - dx;
  }
  function onUp() {
    drag.current = null;
  }

  return (
    <section className="border-t border-hairline py-28 md:py-40" aria-labelledby="bts-title">
      <div className="container-cinema flex items-end justify-between gap-6">
        <div>
          <SectionLabel>Behind The Scenes</SectionLabel>
          <h2 id="bts-title" className="mt-6 font-display text-[44px] leading-[0.95] font-light md:text-7xl">
            Where the magic <em className="text-gold-soft">is made.</em>
          </h2>
        </div>
        <p className="label hidden text-muted md:block">Drag to explore →</p>
      </div>

      <div
        ref={ref}
        role="region"
        aria-label="Behind-the-scenes photos — scroll horizontally"
        tabIndex={0}
        data-cursor="drag"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        className="no-scrollbar mt-14 flex cursor-grab snap-x snap-mandatory gap-4 md:snap-none overflow-x-auto px-5 select-none active:cursor-grabbing md:mt-20 md:gap-6 md:px-10 xl:px-16"
      >
        {tiles.map((img, i) => (
          <figure
            key={i}
            className={`relative shrink-0 snap-start overflow-hidden bg-charcoal ${
              i % 3 === 1 ? "aspect-3/4 w-[62vw] md:w-[22vw]" : "aspect-4/3 w-[80vw] md:w-[34vw]"
            } ${i % 2 ? "md:mt-16" : ""}`}
          >
            <CoverMedia
              image={img}
              alt={img?.alt || `Behind the scenes — ${CAPTIONS[i % CAPTIONS.length]}`}
              variant={i}
              sizes="(min-width: 768px) 34vw, 80vw"
              className="pointer-events-none"
            />
            <figcaption className="label absolute bottom-4 left-4 text-ivory/70">
              {String(i + 1).padStart(2, "0")} · {img?.alt || CAPTIONS[i % CAPTIONS.length]}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
