"use client";

/**
 * Runs `cb` once when `el` comes near the viewport. Used to defer animation
 * setup (text splitting, ScrollTriggers) until it's needed, keeping the main
 * thread free during page load. Returns a cleanup function.
 */
export function onNearViewport(el: Element, cb: () => void, rootMargin = "25% 0px") {
  if (typeof IntersectionObserver === "undefined") {
    cb();
    return () => {};
  }
  const io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect();
        cb();
      }
    },
    { rootMargin },
  );
  io.observe(el);
  return () => io.disconnect();
}
