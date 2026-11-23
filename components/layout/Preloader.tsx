"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/hooks";
import { lockScroll, unlockScroll } from "@/lib/lenis";
import { markIntroDone } from "@/lib/intro";
import { safeSession } from "@/lib/utils";
import { PRELOADER_KEY } from "@/lib/config";
import { Logo } from "@/components/ui/Logo";

const BLADES = 6;

/**
 * Aperture closes and opens to reveal the logo, then letterbox bars open onto
 * the page. ≤ 2s. Skipped on repeat visits in the same session — an inline
 * script in <head> sets `data-preloaded` so it never flashes (see layout).
 */
export function Preloader() {
  const [done, setDone] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (safeSession.get(PRELOADER_KEY)) {
        markIntroDone();
        setDone(true);
        return;
      }
      safeSession.set(PRELOADER_KEY, "1");
      lockScroll();

      const finish = () => {
        unlockScroll();
        setDone(true);
      };

      if (prefersReducedMotion()) {
        markIntroDone();
        gsap.to(root.current, { autoAlpha: 0, duration: 0.4, delay: 0.3, onComplete: finish });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" }, onComplete: finish });
      tl.fromTo(".pl-ring", { strokeDashoffset: 302 }, { strokeDashoffset: 0, duration: 0.7 })
        .fromTo(
          ".pl-blade",
          { rotate: (i) => i * (360 / BLADES) + 40, opacity: 0 },
          { rotate: (i) => i * (360 / BLADES), opacity: 1, duration: 0.45, stagger: 0.02 },
          0.1,
        )
        // Aperture opens
        .to(".pl-iris", { scale: 2.6, opacity: 0, duration: 0.55, ease: "expo.in" }, 0.6)
        .fromTo(".pl-logo", { yPercent: 110 }, { yPercent: 0, duration: 0.6, ease: "expo.out" }, 0.95)
        .to(".pl-line", { scaleX: 1, duration: 0.5, ease: "expo.out" }, 1.0)
        // Letterbox bars open onto the page
        .to(".pl-center", { autoAlpha: 0, duration: 0.25 }, 1.45)
        .call(markIntroDone, [], 1.4)
        .to(".pl-top", { yPercent: -100, duration: 0.55, ease: "expo.inOut" }, 1.4)
        .to(".pl-bottom", { yPercent: 100, duration: 0.55, ease: "expo.inOut" }, 1.4);
    },
    { scope: root },
  );

  if (done) return null;

  return (
    <div ref={root} className="preloader fixed inset-0 z-100" aria-hidden="true">
      <div className="pl-top absolute inset-x-0 top-0 h-1/2 bg-ink" />
      <div className="pl-bottom absolute inset-x-0 bottom-0 h-1/2 bg-ink" />

      <div className="pl-center absolute inset-0 flex flex-col items-center justify-center">
        <svg className="pl-iris h-24 w-24 text-gold" viewBox="0 0 100 100" fill="none">
          <circle
            className="pl-ring"
            cx="50"
            cy="50"
            r="48"
            stroke="currentColor"
            strokeWidth="0.8"
            strokeDasharray="302"
          />
          {Array.from({ length: BLADES }).map((_, i) => (
            <path
              key={i}
              className="pl-blade"
              style={{ transformOrigin: "50px 50px" }}
              d="M50 2 L74 50"
              stroke="currentColor"
              strokeWidth="0.8"
            />
          ))}
        </svg>
        <div className="mt-8 overflow-hidden">
          <div className="pl-logo">
            <Logo className="text-2xl md:text-3xl" />
          </div>
        </div>
        <span className="pl-line mt-5 block h-px w-24 origin-center scale-x-0 bg-gold/70" />
      </div>
    </div>
  );
}
