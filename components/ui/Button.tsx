"use client";

import { useRef, type ReactNode, type MouseEventHandler, type PointerEvent } from "react";
import { gsap } from "@/lib/gsap";
import { useFinePointer, usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { TransitionLink } from "@/components/layout/TransitionLink";

type Variant = "primary" | "outline" | "ghost" | "light";
type Size = "sm" | "md" | "lg";

type Props = {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  size?: Size;
  magnetic?: boolean;
  className?: string;
  onClick?: MouseEventHandler<HTMLElement>;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  /** Opens in a new tab (external links). */
  newTab?: boolean;
  "aria-label"?: string;
  /** Analytics hook name, e.g. "whatsapp_click". */
  "data-track"?: string;
};

const variants: Record<Variant, string> = {
  primary: "btn-primary bg-red text-black hover:bg-paper hover:text-ink",
  outline: "border border-paper/30 text-paper hover:border-paper hover:bg-paper hover:text-ink",
  ghost: "text-paper underline decoration-red decoration-2 underline-offset-8 hover:text-red",
  light: "bg-paper text-ink hover:bg-red hover:text-black",
};

const sizes: Record<Size, string> = {
  sm: "min-h-11 px-5 text-[0.8rem]",
  md: "min-h-12 px-6 text-sm",
  lg: "min-h-14 px-8 text-[0.95rem]",
};

const isExternal = (href: string) => /^(https?:|mailto:|tel:)/.test(href);

/** Magnetic button/link. Magnet effect only on desktop with motion allowed. */
export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  magnetic = true,
  className,
  onClick,
  type = "button",
  disabled,
  newTab,
  ...aria
}: Props) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();
  const active = magnetic && fine && !reduced;

  function onMove(e: PointerEvent) {
    if (!active || !wrapRef.current) return;
    const r = wrapRef.current.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    gsap.to(wrapRef.current, { x: x * 0.3, y: y * 0.4, duration: 0.6, ease: "power3.out" });
    gsap.to(innerRef.current, { x: x * 0.12, y: y * 0.15, duration: 0.6, ease: "power3.out" });
  }

  function onLeave() {
    if (!active) return;
    gsap.to([wrapRef.current, innerRef.current], {
      x: 0,
      y: 0,
      duration: 0.9,
      ease: "elastic.out(1, 0.4)",
    });
  }

  const classes = cn(
    "relative inline-flex shrink-0 items-center justify-center gap-2.5 rounded-full font-sans whitespace-nowrap font-semibold tracking-[-0.01em] transition-colors duration-300 ease-expo-out",
    "disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );

  const content = <span ref={innerRef} className="inline-flex items-center gap-3">{children}</span>;

  let el: ReactNode;
  if (href && isExternal(href)) {
    el = (
      <a
        href={href}
        className={classes}
        onClick={onClick}
        {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...aria}
      >
        {content}
      </a>
    );
  } else if (href) {
    el = (
      <TransitionLink href={href} className={classes} onClick={onClick} {...aria}>
        {content}
      </TransitionLink>
    );
  } else {
    el = (
      <button type={type} className={classes} onClick={onClick} disabled={disabled} {...aria}>
        {content}
      </button>
    );
  }

  return (
    <span
      ref={wrapRef}
      className="inline-flex"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {el}
    </span>
  );
}
