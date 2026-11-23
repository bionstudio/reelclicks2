"use client";

import type Lenis from "lenis";

/** Global Lenis instance store + reference-counted scroll lock. */
let instance: Lenis | null = null;
let locks = 0;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

export function getLenis() {
  return instance;
}

export function lockScroll() {
  locks += 1;
  if (locks === 1) {
    instance?.stop();
    document.documentElement.style.overflow = "hidden";
  }
}

export function unlockScroll() {
  locks = Math.max(0, locks - 1);
  if (locks === 0) {
    instance?.start();
    document.documentElement.style.overflow = "";
  }
}

export function scrollToTop() {
  if (instance) instance.scrollTo(0, { immediate: true, force: true });
  else window.scrollTo(0, 0);
}
