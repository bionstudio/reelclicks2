"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/hooks";
import type { Testimonial } from "@/lib/sanity/types";
import { SectionLabel } from "@/components/ui/SectionLabel";

const INTERVAL = 8000;

/** Slow auto-advancing testimonials. Pauses on hover/focus and for reduced motion. */
export function Testimonials({ items }: { items: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = usePrefersReducedMotion();
  const count = items.length;

  useEffect(() => {
    if (paused || reduced || count < 2) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % count), INTERVAL);
    return () => window.clearInterval(id);
  }, [paused, reduced, count]);

  if (!count) return null;
  const t = items[index];
  const go = (d: number) => setIndex((i) => (i + d + count) % count);

  return (
    <section
      className="container-cinema cv-auto py-28 md:py-44"
      aria-roledescription="carousel"
      aria-label="Client testimonials"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-3">
          <SectionLabel>Kind Words</SectionLabel>
          <p aria-hidden="true" className="mt-8 font-display text-[120px] leading-none text-gold/40 md:text-[180px]">
            &ldquo;
          </p>
        </div>

        <div className="md:col-span-9">
          <div className="relative min-h-[320px] md:min-h-[380px]" aria-live={paused ? "polite" : "off"}>
            <AnimatePresence mode="wait">
              <motion.figure
                key={t._id}
                initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(6px)" }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <blockquote className="font-display text-3xl leading-[1.2] font-light text-ivory italic md:text-5xl xl:text-6xl">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-10 flex items-center gap-4">
                  <span aria-hidden="true" className="h-px w-10 bg-gold" />
                  <span>
                    <span className="block text-ivory">{t.name}</span>
                    <span className="label mt-1 block text-muted">
                      {[t.eventType, t.city].filter(Boolean).join(" · ")}
                    </span>
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          {count > 1 && (
            <div className="mt-12 flex items-center gap-6">
              <button type="button" onClick={() => go(-1)} aria-label="Previous testimonial" className="carousel-btn">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </button>
              <span className="label text-muted">
                <span className="text-ivory">{String(index + 1).padStart(2, "0")}</span> / {String(count).padStart(2, "0")}
              </span>
              <button type="button" onClick={() => go(1)} aria-label="Next testimonial" className="carousel-btn">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </button>
              <span aria-hidden="true" className="relative ml-2 h-px flex-1 bg-ivory/10">
                <span
                  key={`${index}-${paused}`}
                  className="absolute inset-0 origin-left bg-gold"
                  style={{
                    // transform (not width) so the progress runs on the GPU without re-layout.
                    transform: paused || reduced ? `scaleX(${(index + 1) / count})` : undefined,
                    animation: paused || reduced ? undefined : `progress ${INTERVAL}ms linear forwards`,
                  }}
                />
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
