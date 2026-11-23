"use client";

import dynamic from "next/dynamic";

/**
 * Non-critical client features, loaded after the page is interactive so they
 * stay out of the initial JavaScript and hydration work.
 */
const CustomCursor = dynamic(() => import("./CustomCursor").then((m) => m.CustomCursor), { ssr: false });
const Analytics = dynamic(() => import("@/components/analytics/Analytics").then((m) => m.Analytics), { ssr: false });

export function DeferredExtras() {
  return (
    <>
      <CustomCursor />
      <Analytics />
    </>
  );
}
