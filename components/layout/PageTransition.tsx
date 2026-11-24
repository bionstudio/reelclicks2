"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/hooks";
import { scrollToTop } from "@/lib/lenis";

type TransitionContextValue = { navigate: (href: string) => void };

const TransitionContext = createContext<TransitionContextValue>({
  navigate: () => {},
});

export const usePageTransition = () => useContext(TransitionContext);

/**
 * Black curtain wipe with a red edge between routes.
 * Cover → router.push → reveal once the new pathname renders.
 */
export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const curtainRef = useRef<HTMLDivElement>(null);
  const covering = useRef(false);
  const fallbackTimer = useRef<number | undefined>(undefined);

  const reveal = useCallback(() => {
    const curtain = curtainRef.current;
    window.clearTimeout(fallbackTimer.current);
    if (!curtain || !covering.current) return;
    covering.current = false;
    const anchor = window.location.hash
      ? document.getElementById(decodeURIComponent(window.location.hash.slice(1)))
      : null;
    if (anchor) anchor.scrollIntoView({ behavior: "instant" });
    else scrollToTop();
    ScrollTrigger.refresh();
    gsap.to(curtain, {
      yPercent: -100,
      duration: 0.9,
      delay: 0.1,
      ease: "power3.inOut",
      onComplete: () => {
        gsap.set(curtain, { yPercent: 100, visibility: "hidden" });
      },
    });
  }, []);

  const navigate = useCallback(
    (href: string) => {
      const target = new URL(href, window.location.href);
      const curtain = curtainRef.current;

      // Same page (query/hash change only) or reduced motion: plain navigation.
      if (target.pathname === window.location.pathname || !curtain || prefersReducedMotion()) {
        router.push(href);
        return;
      }

      covering.current = true;
      gsap.killTweensOf(curtain);
      gsap.set(curtain, { yPercent: 100, visibility: "visible" });
      gsap.to(curtain, {
        yPercent: 0,
        duration: 0.7,
        ease: "power3.inOut",
        onComplete: () => {
          router.push(href);
          // Safety net: never leave the curtain down.
          fallbackTimer.current = window.setTimeout(reveal, 4000);
        },
      });
    },
    [router, reveal],
  );

  useEffect(() => {
    reveal();
  }, [pathname, reveal]);

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      <div
        ref={curtainRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-95 bg-black"
        style={{ transform: "translateY(100%)", visibility: "hidden" }}
      >
        <span className="absolute inset-x-0 top-0 h-1.5 bg-red" />
      </div>
    </TransitionContext.Provider>
  );
}
