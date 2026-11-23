"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  remove: (id: string) => void;
  reset: (id?: string) => void;
};
type TurnstileWindow = Window & { turnstile?: TurnstileApi };

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

/** Cloudflare Turnstile (invisible-ish spam check). Renders nothing when no site key is set. */
export function Turnstile({ onToken, resetKey }: { onToken: (token: string) => void; resetKey?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);

  function render() {
    const api = (window as TurnstileWindow).turnstile;
    if (!api || !ref.current || widget.current || !SITE_KEY) return;
    widget.current = api.render(ref.current, {
      sitekey: SITE_KEY,
      theme: "dark",
      appearance: "interaction-only",
      callback: (t: string) => onToken(t),
      "expired-callback": () => onToken(""),
      "error-callback": () => onToken(""),
    });
  }

  useEffect(() => {
    render();
    return () => {
      const api = (window as TurnstileWindow).turnstile;
      if (widget.current && api) api.remove(widget.current);
      widget.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (resetKey && widget.current) (window as TurnstileWindow).turnstile?.reset(widget.current);
  }, [resetKey]);

  if (!SITE_KEY) return null;
  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="lazyOnload" onLoad={render} />
      <div ref={ref} className="min-h-0" />
    </>
  );
}
