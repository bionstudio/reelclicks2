"use client";

import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { lockScroll, unlockScroll } from "@/lib/lenis";

export type LightboxProps = {
  open: boolean;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  /** Accessible name of the dialog, e.g. the film title. */
  label: string;
  /** Main media (letterboxed, centred). */
  children: ReactNode;
  /** Optional info panel under the media (title, category, story…). */
  footer?: ReactNode;
};

/** Full-screen black letterboxed dialog with keyboard support and focus trap. */
const noop = () => () => {};

export function LightboxPortal(props: LightboxProps) {
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  return !mounted
    ? null
    : createPortal(
        <AnimatePresence>{props.open && <LightboxDialog {...props} />}</AnimatePresence>,
        document.body,
      );
}

function LightboxDialog({ onClose, onPrev, onNext, label, children, footer }: LightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    lockScroll();
    closeRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft" && onPrev) onPrev();
      else if (e.key === "ArrowRight" && onNext) onNext();
      else if (e.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), video[controls], [tabindex]:not([tabindex="-1"])',
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      unlockScroll();
      previouslyFocused?.focus();
    };
  }, [onClose, onPrev, onNext]);

  return (
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      className="fixed inset-0 z-80 flex flex-col bg-ink"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      data-lenis-prevent=""
    >
      {/* Top letterbox bar */}
      <div className="flex h-16 shrink-0 items-center justify-between px-4 md:h-20 md:px-8">
        <p className="label truncate pr-4 text-paper/60">{label}</p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="label flex h-11 min-w-11 items-center justify-center gap-3 text-paper hover:text-red"
          aria-label="Close"
        >
          <span className="hidden md:inline">Close</span>
          <span aria-hidden="true" className="relative block h-4 w-4">
            <span className="absolute top-1/2 left-0 h-px w-4 rotate-45 bg-current" />
            <span className="absolute top-1/2 left-0 h-px w-4 -rotate-45 bg-current" />
          </span>
        </button>
      </div>

      <motion.div
        className="relative flex min-h-0 flex-1 items-center justify-center px-0 md:px-20"
        initial={{ clipPath: "inset(12% 0% 12% 0%)" }}
        animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}

        {onPrev && (
          <NavButton side="left" onClick={onPrev} label="Previous" />
        )}
        {onNext && (
          <NavButton side="right" onClick={onNext} label="Next" />
        )}
      </motion.div>

      {/* Bottom letterbox bar */}
      <div className="min-h-16 shrink-0 px-4 py-4 md:min-h-20 md:px-8">{footer}</div>
    </motion.div>
  );
}

function NavButton({ side, onClick, label }: { side: "left" | "right"; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`absolute top-1/2 ${side === "left" ? "left-2 md:left-6" : "right-2 md:right-6"} flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-red/40 bg-ink/60 text-paper backdrop-blur transition-colors hover:border-red hover:text-red`}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d={side === "left" ? "M10 3L5 8l5 5" : "M6 3l5 5-5 5"}
          stroke="currentColor"
          strokeWidth="1.2"
        />
      </svg>
    </button>
  );
}
