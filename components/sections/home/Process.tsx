"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/hooks";
import { SectionLabel } from "@/components/ui/SectionLabel";

type Step = { title: string; text: string };

/** Consult → Plan → Shoot → Edit → Deliver, on a red timeline that draws on scroll. */
export function Process({ steps }: { steps: Step[] }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      // Scoped so selectors still resolve when matchMedia re-runs on resize.
      const mm = gsap.matchMedia(root.current ?? undefined);
      const trigger = { trigger: ".process-list", start: "top 75%", end: "bottom 60%", scrub: true };
      mm.add("(min-width: 1024px)", () => {
        gsap.fromTo(".process-line", { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: trigger });
      });
      mm.add("(max-width: 1023px)", () => {
        gsap.fromTo(".process-line", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: trigger });
      });
      gsap.utils.toArray<HTMLElement>(".process-step").forEach((el) => {
        gsap.from(el, {
          autoAlpha: 0,
          y: 30,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="theme-light py-28 md:py-40" aria-labelledby="process-title">
      <div className="container-cinema">
        <SectionLabel>How We Work</SectionLabel>
        <h2 id="process-title" className="mt-6 max-w-4xl font-display text-[44px] leading-[0.92] md:text-7xl xl:text-8xl">
          From first hello <em className="text-red">to final frame.</em>
        </h2>

        <ol className="process-list relative mt-16 grid gap-12 pl-10 md:mt-24 md:grid-cols-2 md:gap-x-10 lg:grid-cols-5 lg:gap-8 lg:pt-12 lg:pl-0">
          {/* Timeline: horizontal on desktop, vertical on mobile */}
          <span aria-hidden="true" className="absolute top-0 bottom-0 left-[5px] w-0.5 bg-paper/10 lg:top-[5px] lg:right-0 lg:bottom-auto lg:left-0 lg:h-0.5 lg:w-full" />
          <span
            aria-hidden="true"
            className="process-line absolute top-0 bottom-0 left-[5px] w-0.5 origin-top bg-red lg:top-[5px] lg:right-0 lg:bottom-auto lg:left-0 lg:h-0.5 lg:w-full lg:origin-left"
          />
          {steps.map((step, i) => (
            <li key={step.title} className="process-step relative">
              <span aria-hidden="true" className="absolute top-1.5 -left-10 h-3 w-3 rounded-full bg-red ring-4 ring-ink lg:-top-12 lg:left-0" />
              <span className="label text-paper/50">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 font-display text-4xl font-semibold text-paper">{step.title}</h3>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-paper/60">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
