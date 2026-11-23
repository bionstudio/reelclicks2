"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { LightboxProps } from "./LightboxPortal";

// The dialog (and the animation library) loads the first time a lightbox opens.
const LightboxPortal = dynamic(() => import("./LightboxPortal").then((m) => m.LightboxPortal), { ssr: false });

/** Full-screen black letterboxed dialog with keyboard support and focus trap (lazy-loaded). */
export function Lightbox(props: LightboxProps) {
  const [loaded, setLoaded] = useState(false);
  // Adjust state during render (React's documented pattern) — no effect needed.
  if (props.open && !loaded) setLoaded(true);
  return loaded ? <LightboxPortal {...props} /> : null;
}