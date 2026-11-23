"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/hooks";
import { onNearViewport } from "@/lib/near";
import { SectionLabel } from "@/components/ui/SectionLabel";

/** Large serif paragraph whose words fill from muted to ivory as you scroll. */
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
                { color: "#77726a" },
                {
                  color: "#F3EEE6",
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
    <section ref={root} className="container-cinema py-32 md:py-56" aria-label="Our manifesto">
      <div className="grid gap-10 md:grid-cols-12">
        <SectionLabel className="md:col-span-3 md:pt-4">Our Philosophy</SectionLabel>
        <p
          ref={textRef}
          className="font-display text-[34px] leading-[1.12] font-light text-ivory sm:text-5xl md:col-span-9 md:text-6xl xl:text-[84px]"
        >
          {text}
        </p>
      </div>
    </section>
  );
}
