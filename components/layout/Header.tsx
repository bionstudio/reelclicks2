"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { navigation } from "@/lib/config";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { TransitionLink } from "@/components/layout/TransitionLink";
import dynamic from "next/dynamic";

// Loaded on first use (keeps the animation library out of the initial bundle).
const loadMenu = () => import("@/components/layout/MobileMenu").then((m) => m.MobileMenu);
const MobileMenu = dynamic(loadMenu, { ssr: false });

/** Transparent over the hero → blurred black once the page scrolls. */
export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuLoaded, setMenuLoaded] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color,padding] duration-700 ease-expo-out",
          scrolled
            ? "border-b border-hairline bg-ink/75 py-3 backdrop-blur-md"
            : "border-b border-transparent bg-transparent py-5 md:py-7",
        )}
      >
        <div className="container-cinema flex items-center justify-between gap-6">
          <TransitionLink href="/" aria-label="REELCLICKS.IN — Home" className="flex min-h-11 items-center">
            <Logo className="text-lg md:text-xl" />
          </TransitionLink>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {navigation.map((item) => (
                <li key={item.href}>
                  <TransitionLink
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "label group relative py-2 transition-colors duration-500",
                      isActive(item.href) ? "text-gold" : "text-ivory/80 hover:text-ivory",
                    )}
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute -bottom-0.5 left-0 h-px w-full origin-left bg-gold transition-transform duration-700 ease-expo-out",
                        isActive(item.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                      )}
                    />
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex">
              <Button href="/contact" size="sm">
                Book Your Date
              </Button>
            </span>
            <button
              type="button"
              className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 lg:hidden"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onPointerEnter={loadMenu}
              onTouchStart={loadMenu}
              onFocus={loadMenu}
              onClick={() => {
                setMenuLoaded(true);
                setMenuOpen(true);
              }}
            >
              <span className="block h-px w-6 bg-ivory" />
              <span className="block h-px w-4 self-end bg-gold" />
            </button>
          </div>
        </div>
      </header>

      {menuLoaded && <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />}
    </>
  );
}
