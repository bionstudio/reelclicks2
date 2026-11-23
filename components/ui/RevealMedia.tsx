"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/hooks";
import { onNearViewport } from "@/lib/near";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  /** Direction the clip opens from. */
  from?: "bottom" | "top" | "left" | "right";
  /** Subtle parallax drift on the inner media while scrolling (desktop only). */
  parallax?: boolean;
  delay?: number;
};

const clips = {
  bottom: "inset(100% 0% 0% 0%)",
  top: "inset(0% 0% 100% 0%)",
  left: "inset(0% 100% 0% 0%)",
  right: "inset(0% 0% 0% 100%)",
};

/** Clip-path reveal for images and videos, with optional parallax depth. */
export function RevealMedia({ children, className, from = "bottom", parallax = false, delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      const inner = innerRef.current;
      if (!el || !inner) return;
      if (prefersReducedMotion()) {
        gsap.set(el, { autoAlpha: 1 });
        return;
      }

      const mobile = window.innerWidth < 768;
      const tweens: gsap.core.Animation[] = [];

      // Set up only when the media comes into view — keeps page load light.
      const stop = onNearViewport(
        el,
        () => {
          gsap.set(el, { autoAlpha: 1 });
          tweens.push(
            gsap.fromTo(
              el,
              { clipPath: clips[from] },
              { clipPath: "inset(0% 0% 0% 0%)", duration: mobile ? 1 : 1.6, ease: "expo.out", delay },
            ),
            gsap.fromTo(
              inner,
              { scale: mobile ? 1.08 : 1.2 },
              { scale: 1, duration: mobile ? 1.2 : 2, ease: "expo.out", delay },
            ),
          );
          if (parallax && !mobile) {
            tweens.push(
              gsap.fromTo(
                inner.firstElementChild,
                { yPercent: -6 },
                {
                  yPercent: 6,
                  ease: "none",
                  scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
                },
              ),
            );
          }
        },
        "0px 0px -10% 0px",
      );

      return () => {
        stop();
        tweens.forEach((t) => {
          t.scrollTrigger?.kill();
          t.kill();
        });
      };
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)} data-reveal="">
      <div ref={innerRef} className="h-full w-full">
        <div className={cn("h-full w-full", parallax && "scale-[1.14]")}>{children}</div>
      </div>
    </div>
  );
}
