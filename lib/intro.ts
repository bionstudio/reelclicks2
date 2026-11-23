"use client";

/**
 * Coordinates hero animations with the preloader: hero reveals wait until the
 * letterbox bars start opening (or run immediately on repeat visits).
 */
const EVENT = "rc:intro-done";
const ATTR = "data-intro-done";

export function markIntroDone() {
  document.documentElement.setAttribute(ATTR, "");
  window.dispatchEvent(new Event(EVENT));
}

export function isIntroDone() {
  const html = document.documentElement;
  return html.hasAttribute(ATTR) || html.hasAttribute("data-preloaded");
}

/** Runs `cb` once the intro is done. Returns an unsubscribe function. */
export function onIntroDone(cb: () => void) {
  if (isIntroDone()) {
    cb();
    return () => {};
  }
  window.addEventListener(EVENT, cb, { once: true });
  return () => window.removeEventListener(EVENT, cb);
}
