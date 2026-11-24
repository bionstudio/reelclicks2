"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Faq } from "@/lib/sanity/types";
import { cn } from "@/lib/utils";

/** Accessible FAQ accordion (one open at a time). */
export function FaqAccordion({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState<string | null>(items[0]?._id ?? null);
  const baseId = useId();

  return (
    <ul className="border-t border-hairline">
      {items.map((f, i) => {
        const isOpen = open === f._id;
        const btnId = `${baseId}-q${i}`;
        const panelId = `${baseId}-a${i}`;
        return (
          <li key={f._id} className="border-b border-hairline">
            <h3>
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : f._id)}
                className="group flex w-full items-center justify-between gap-6 py-7 text-left"
              >
                <span
                  className={cn(
                    "font-display text-2xl transition-colors md:text-3xl",
                    isOpen ? "text-red" : "text-paper group-hover:text-red",
                  )}
                >
                  {f.question}
                </span>
                <span aria-hidden="true" className="relative h-4 w-4 shrink-0 text-red">
                  <span className="absolute top-1/2 left-0 h-px w-4 bg-current" />
                  <span
                    className={cn(
                      "absolute top-0 left-1/2 h-4 w-px bg-current transition-transform duration-500",
                      isOpen && "scale-y-0",
                    )}
                  />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-3xl pb-8 leading-relaxed text-paper/60">{f.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
