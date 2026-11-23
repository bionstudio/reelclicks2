"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/hooks";
import { onIntroDone } from "@/lib/intro";
import { onNearViewport } from "@/lib/near";

type Props = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** "scroll" reveals when in view; "mount" reveals immediately (hero). */
  trigger?: "scroll" | "mount";
  delay?: number;
  stagger?: number;
};

/** Masked line-by-line text reveal (GSAP SplitText). */
export function RevealText({
  children,
  as: Tag = "div",
  className,
  trigger = "scroll",
  delay = 0,
  stagger = 0.12,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (prefersReducedMotion()) {
        gsap.set(el, { autoAlpha: 1 });
        return;
      }
      const mobile = window.innerWidth < 768;
      let unsubscribe = () => {};
      let split: SplitText | null = null;

      const run = () => {
        split = SplitText.create(el, {
          type: "lines",
          mask: "lines",
          linesClass: "reveal-line",
          autoSplit: true,
          onSplit(self) {
            gsap.set(el, { autoAlpha: 1 });
            const tween = gsap.from(self.lines, {
              yPercent: 110,
              duration: mobile ? 0.9 : 1.4,
              ease: "expo.out",
              stagger: mobile ? stagger * 0.7 : stagger,
              delay,
              paused: trigger === "mount",
            });
            // "mount" reveals wait for the preloader's letterbox to open.
            if (trigger === "mount") {
              unsubscribe();
              unsubscribe = onIntroDone(() => tween.play());
            }
            return tween;
          },
        });
      };

      // Scroll reveals are only split when they come into view — keeps page load light.
      const stopWatching = trigger === "scroll" ? onNearViewport(el, run, "0px 0px -12% 0px") : (run(), () => {});

      return () => {
        stopWatching();
        unsubscribe();
        split?.revert();
      };
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className} data-reveal={trigger}>
      {children}
    </Tag>
  );
}
