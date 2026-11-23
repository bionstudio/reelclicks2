"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import { usePageTransition } from "@/components/layout/PageTransition";

type Props = ComponentProps<typeof Link> & { href: string };

/** next/link that plays the curtain transition for internal route changes. */
export function TransitionLink({ href, onClick, target, ...rest }: Props) {
  const { navigate } = usePageTransition();

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e);
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      (target && target !== "_self") ||
      href.startsWith("#") ||
      /^(https?:|mailto:|tel:)/.test(href)
    ) {
      return;
    }
    e.preventDefault();
    navigate(href);
  }

  return <Link href={href} target={target} onClick={handleClick} {...rest} />;
}
