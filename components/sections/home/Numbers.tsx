"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/hooks";
import type { Stat } from "@/lib/sanity/types";

/** Animated counters (values from Sanity → Numbers). */
export function Numbers({ stats }: { stats: Stat[] }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const els = gsap.utils.toArray<HTMLElement>(".stat-value", root.current);
      els.forEach((el) => {
        const target = Number(el.dataset.value ?? 0);
        const counter = { v: 0 };
        el.textContent = "0";
        gsap.to(counter, {
          v: target,
          duration: 2.2,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          onUpdate: () => {
            el.textContent = Math.round(counter.v).toLocaleString("en-IN");
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="theme-light" aria-label="REELCLICKS in numbers">
      <div className="container-cinema pb-24 md:pb-36">
      <dl className="grid grid-cols-2 border-t border-hairline lg:grid-cols-4">
        {stats.slice(0, 4).map((s, i) => (
          <div
            key={s._id}
            className={`flex flex-col-reverse gap-3 border-b border-hairline py-10 md:py-14 lg:border-b-0 ${
              i % 2 === 0 ? "pr-4" : "border-l border-hairline pl-6"
            } ${i > 0 ? "lg:border-l lg:pl-8" : ""}`}
          >
            <dt className="label text-paper/60">{s.label}</dt>
            <dd className="font-display text-6xl leading-none font-bold text-paper md:text-8xl xl:text-9xl">
              <span className="stat-value" data-value={s.value}>
                {s.value.toLocaleString("en-IN")}
              </span>
              <span className="text-red">{s.suffix}</span>
            </dd>
          </div>
        ))}
      </dl>
      </div>
    </section>
  );
}
