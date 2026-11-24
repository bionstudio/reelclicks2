"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { getLenis } from "@/lib/lenis";
import { cn } from "@/lib/utils";

type Item = { slug: string; title: string };

/**
 * Sticky service index. Desktop: vertical list beside the content.
 * Mobile: horizontal chip bar under the header. Highlights the service in view.
 */
export function ServiceIndex({ items, variant }: { items: Item[]; variant: "side" | "bar" }) {
  const [active, setActive] = useState(items[0]?.slug);
  const barRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const sections = items
      .map((i) => document.getElementById(i.slug))
      .filter((el): el is HTMLElement => Boolean(el));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [items]);

  // Keep the active chip visible in the mobile bar.
  useEffect(() => {
    if (variant !== "bar" || !barRef.current) return;
    const chip = barRef.current.querySelector<HTMLElement>(`[data-slug="${active}"]`);
    chip?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [active, variant]);

  function go(e: MouseEvent<HTMLAnchorElement>, slug: string) {
    const target = document.getElementById(slug);
    if (!target) return;
    e.preventDefault();
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(target, { offset: variant === "bar" ? -120 : -100 });
    else target.scrollIntoView({ behavior: "smooth" });
    history.replaceState(null, "", `#${slug}`);
  }

  if (variant === "bar") {
    return (
      <nav aria-label="Services" className="sticky top-[69px] z-30 -mx-5 border-y border-hairline bg-ink/90 backdrop-blur-md md:-mx-10 lg:hidden">
        <ul ref={barRef} className="no-scrollbar flex gap-2 overflow-x-auto px-5 py-3 md:px-10">
          {items.map((item, i) => (
            <li key={item.slug} data-slug={item.slug} className="shrink-0">
              <a
                href={`#${item.slug}`}
                onClick={(e) => go(e, item.slug)}
                aria-current={active === item.slug ? "true" : undefined}
                className={cn(
                  "label flex min-h-11 items-center rounded-full border px-4 transition-colors",
                  active === item.slug ? "border-red bg-red text-black" : "border-red/30 text-paper/80",
                )}
              >
                {String(i + 1).padStart(2, "0")} · {item.title.replace(/^Professional /, "")}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  return (
    <nav aria-label="Services" className="sticky top-32">
      <p className="label text-red">Index</p>
      <ol className="mt-6 space-y-1 border-l border-hairline">
        {items.map((item, i) => {
          const isActive = active === item.slug;
          return (
            <li key={item.slug}>
              <a
                href={`#${item.slug}`}
                onClick={(e) => go(e, item.slug)}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "relative flex min-h-11 items-center gap-4 py-1.5 pl-5 text-sm transition-colors duration-500",
                  isActive ? "text-paper" : "text-paper/60 hover:text-paper",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute top-0 -left-px h-full w-px origin-top bg-red transition-transform duration-700 ease-expo-out",
                    isActive ? "scale-y-100" : "scale-y-0",
                  )}
                />
                <span className={cn("label w-6", isActive ? "text-red" : "text-paper/40")}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                {item.title}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
