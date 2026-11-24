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
          "theme-dark fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color,padding] duration-700 ease-expo-out",
          scrolled
            ? "border-b border-hairline bg-black/80 py-3 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent py-5 md:py-6",
        )}
      >
        <div className="container-cinema flex items-center justify-between gap-6">
          <TransitionLink href="/" aria-label="REELCLICKS.IN — Home" className="flex min-h-11 items-center">
            <Logo className="text-lg md:text-xl" />
          </TransitionLink>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1 rounded-full border border-hairline bg-black/40 p-1 backdrop-blur-md">
              {navigation.map((item) => (
                <li key={item.href}>
                  <TransitionLink
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "relative inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors duration-300",
                      isActive(item.href) ? "bg-paper text-ink" : "text-paper/75 hover:text-paper",
                    )}
                  >
                    {isActive(item.href) && <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-red" />}
                    {item.label}
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
              <span className="block h-0.5 w-6 rounded-full bg-paper" />
              <span className="block h-0.5 w-4 self-end rounded-full bg-red" />
            </button>
          </div>
        </div>
      </header>

      {menuLoaded && <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />}
    </>
  );
}
