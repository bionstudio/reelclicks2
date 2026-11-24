"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/hooks";
import { onNearViewport } from "@/lib/near";
import { SectionLabel } from "@/components/ui/SectionLabel";

/** Large paragraph on cream whose words fill from faint to solid black as you scroll. */
export function Manifesto({ text }: { text: string }) {
  const root = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const el = textRef.current;
      if (!el || prefersReducedMotion()) return;
      let split: SplitText | null = null;
      // Split into words only when the paragraph approaches the viewport.
      const stop = onNearViewport(
        el,
        () => {
          split = SplitText.create(el, {
            type: "words",
            // No aria-label on the <p> (not allowed); screen readers read the words as-is.
            aria: "none",
            autoSplit: true,
            onSplit(self) {
              return gsap.fromTo(
                self.words,
                { color: "rgba(11, 11, 11, 0.16)" },
                {
                  color: "#0B0B0B",
                  ease: "none",
                  stagger: 0.1,
                  scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: true },
                },
              );
            },
          });
        },
        "50% 0px",
      );
      return () => {
        stop();
        split?.revert();
      };
    },
    { scope: root },
  );

  return (
    <section ref={root} className="theme-light" aria-label="Our manifesto">
      <div className="container-cinema grid gap-10 pt-28 pb-20 md:grid-cols-12 md:pt-44 md:pb-28">
        <SectionLabel className="md:col-span-3 md:pt-4">Our Philosophy</SectionLabel>
        <p
          ref={textRef}
          className="font-display text-[34px] leading-[1.04] font-medium text-paper sm:text-5xl md:col-span-9 md:text-6xl xl:text-[80px]"
        >
          {text}
        </p>
      </div>
    </section>
  );
}
