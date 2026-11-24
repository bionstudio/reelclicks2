"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useFinePointer, usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

type Mode = "default" | "link" | "play" | "view" | "drag";

/**
 * Gold circle cursor (desktop only). Add `data-cursor="play" | "view" | "drag"`
 * to any element to show that label over it.
 */
export function CustomCursor() {
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();
  if (!fine || reduced) return null;
  return <Cursor />;
}

function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("default");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" });

    const onMove = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      setVisible(true);
    };
    const onOver = (e: PointerEvent) => {
      const target = e.target as Element | null;
      const labelled = target?.closest<HTMLElement>("[data-cursor]");
      if (labelled) {
        const v = labelled.dataset.cursor;
        setMode(v === "view" || v === "drag" ? v : "play");
      }
      else if (target?.closest("a, button, [role='button'], input, select, textarea, label"))
        setMode("link");
      else setMode("default");
    };
    const onLeave = () => setVisible(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const labelled = mode === "play" || mode === "view" || mode === "drag";

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-110 -translate-x-1/2 -translate-y-1/2"
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-full border transition-[width,height,background-color,border-color,opacity] duration-500 ease-expo-out",
          visible ? "opacity-100" : "opacity-0",
          labelled
            ? "h-24 w-24 border-red bg-red/90 backdrop-blur-sm"
            : mode === "link"
              ? "h-14 w-14 border-red/80 bg-red/10"
              : "h-8 w-8 border-red/70 bg-transparent",
        )}
      >
        <span
          className={cn(
            "label text-[0.6rem] text-black transition-opacity duration-300",
            labelled ? "opacity-100" : "opacity-0",
          )}
        >
          {mode === "view" ? "View" : mode === "drag" ? "Drag" : "Play"}
        </span>
      </div>
    </div>
  );
}
