"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { navigation, siteConfig } from "@/lib/config";
import { cn, telLink, whatsappLink } from "@/lib/utils";
import { lockScroll, unlockScroll } from "@/lib/lenis";
import { Logo } from "@/components/ui/Logo";
import { TransitionLink } from "@/components/layout/TransitionLink";

const ease = [0.16, 1, 0.3, 1] as const;

/** Full-screen cinematic menu (mobile / tablet). */
export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return <AnimatePresence>{open && <MenuPanel onClose={onClose} />}</AnimatePresence>;
}

function MenuPanel({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();
  const closeRef = useRef<HTMLButtonElement>(null);
  const { founder, ceo } = siteConfig.people;

  useEffect(() => {
    lockScroll();
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      unlockScroll();
    };
  }, [onClose]);

  return (
    <motion.div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="theme-dark fixed inset-0 z-70 flex flex-col bg-black"
      initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
      animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
      exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
      transition={{ duration: 0.8, ease }}
    >

      <div className="container-cinema relative flex items-center justify-between py-5">
        <Logo className="text-lg" />
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="relative flex h-11 w-11 items-center justify-center"
        >
          <span className="absolute h-0.5 w-6 rotate-45 rounded-full bg-paper" />
          <span className="absolute h-0.5 w-6 -rotate-45 rounded-full bg-red" />
        </button>
      </div>

      <nav aria-label="Mobile" className="container-cinema relative flex flex-1 flex-col justify-center">
        <ul className="space-y-1">
          {navigation.map((item, i) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <li key={item.href} className="overflow-hidden">
                <motion.div
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.9, ease, delay: 0.25 + i * 0.06 }}
                >
                  <TransitionLink
                    href={item.href}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-baseline gap-5 py-1 font-display text-[48px] leading-[1.05] font-semibold sm:text-6xl",
                      active ? "text-red" : "text-paper",
                    )}
                  >
                    <span className="label text-paper/40">0{i + 1}</span>
                    {active ? <em>{item.label}</em> : item.label}
                  </TransitionLink>
                </motion.div>
              </li>
            );
          })}
        </ul>
      </nav>

      <motion.div
        className="container-cinema relative grid grid-cols-2 gap-4 border-t border-hairline py-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        {[founder, ceo].map((p) => (
          <div key={p.tel} className="space-y-1">
            <p className="label text-paper/50">{p.role}</p>
            <a href={telLink(p.tel)} className="block min-h-11 py-2 text-sm text-paper">
              {p.phone}
            </a>
          </div>
        ))}
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          data-track="whatsapp_click"
          className="col-span-2 flex min-h-12 items-center justify-center rounded-full bg-red font-semibold text-black"
        >
          WhatsApp Us
        </a>
      </motion.div>
    </motion.div>
  );
}
