"use client";

type Params = Record<string, string | number | boolean | undefined>;

type TrackWindow = Window & {
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
  clarity?: (...args: unknown[]) => void;
};

/**
 * Sends an analytics event to whichever trackers are loaded (GA4, Meta Pixel,
 * Clarity). Safe no-op when none are configured. Wired up in Phase 9.
 */
export function track(event: string, params: Params = {}) {
  if (typeof window === "undefined") return;
  const w = window as TrackWindow;
  try {
    w.gtag?.("event", event, params);
    if (event === "form_submit") w.fbq?.("track", "Lead", params);
    else w.fbq?.("trackCustom", event, params);
    w.clarity?.("event", event);
  } catch {
    /* never let analytics break the page */
  }
}
