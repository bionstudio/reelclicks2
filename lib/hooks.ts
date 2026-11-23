"use client";

import { useSyncExternalStore } from "react";

function subscribeMedia(query: string) {
  return (callback: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", callback);
    return () => mql.removeEventListener("change", callback);
  };
}

/** Reactive CSS media query. Returns `serverValue` during SSR. */
export function useMediaQuery(query: string, serverValue = false) {
  return useSyncExternalStore(
    subscribeMedia(query),
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

export function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** True on devices with a precise pointer that can hover (desktop). */
export function useFinePointer() {
  return useMediaQuery("(hover: hover) and (pointer: fine)");
}

/** True on low-end devices or with Data Saver on (set by the boot script in app/layout.tsx). */
export function isLiteDevice() {
  return typeof document !== "undefined" && document.documentElement.hasAttribute("data-lite");
}

/** Reduced motion requested by the user — or a low-end device, which gets the lighter experience. */
export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    (window.matchMedia("(prefers-reduced-motion: reduce)").matches || isLiteDevice())
  );
}
