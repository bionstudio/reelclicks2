"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/hooks";
import { SectionLabel } from "@/components/ui/SectionLabel";

type Step = { title: string; text: string };

/** Consult → Plan → Shoot → Edit → Deliver, on a gold timeline that draws on scroll. */
export function Process({ steps }: { steps: Step[] }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      // Scoped so selectors still resolve when matchMedia re-runs on resize.
      const mm = gsap.matchMedia(root.current ?? undefined);
      const trigger = { trigger: ".process-list", start: "top 75%", end: "bottom 60%", scrub: true };
      mm.add("(min-width: 768px)", () => {
        gsap.fromTo(".process-line", { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: trigger });
      });
      mm.add("(max-width: 767px)", () => {
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
    <section ref={root} className="border-t border-hairline bg-charcoal/40 py-28 md:py-40" aria-labelledby="process-title">
      <div className="container-cinema">
        <SectionLabel>How We Work</SectionLabel>
        <h2 id="process-title" className="mt-6 max-w-3xl font-display text-[44px] leading-[0.95] font-light md:text-7xl">
          From first hello <em className="text-gold-soft">to final frame.</em>
        </h2>

        <ol className="process-list relative mt-16 grid gap-12 pl-10 md:mt-24 md:grid-cols-5 md:gap-8 md:pt-12 md:pl-0">
          {/* Timeline: horizontal on desktop, vertical on mobile */}
          <span aria-hidden="true" className="absolute top-0 bottom-0 left-[5px] w-px bg-ivory/10 md:top-[5px] md:right-0 md:bottom-auto md:left-0 md:h-px md:w-full" />
          <span
            aria-hidden="true"
            className="process-line absolute top-0 bottom-0 left-[5px] w-px origin-top bg-gold md:top-[5px] md:right-0 md:bottom-auto md:left-0 md:h-px md:w-full md:origin-left"
          />
          {steps.map((step, i) => (
            <li key={step.title} className="process-step relative">
              <span aria-hidden="true" className="absolute top-2 -left-10 h-[11px] w-[11px] rounded-full border border-gold bg-ink md:-top-12 md:left-0" />
              <span className="label text-gold">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 font-display text-4xl font-light text-ivory">{step.title}</h3>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
