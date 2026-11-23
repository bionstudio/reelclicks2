"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { track } from "@/lib/track";

// IDs are validated so nothing unexpected can be injected into the inline scripts.
const GA4 = /^G-[A-Z0-9]+$/.test(process.env.NEXT_PUBLIC_GA4_ID ?? "") ? process.env.NEXT_PUBLIC_GA4_ID : undefined;
const PIXEL = /^\d{5,20}$/.test(process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "") ? process.env.NEXT_PUBLIC_META_PIXEL_ID : undefined;
const CLARITY = /^[a-z0-9]{6,20}$/i.test(process.env.NEXT_PUBLIC_CLARITY_ID ?? "") ? process.env.NEXT_PUBLIC_CLARITY_ID : undefined;

/**
 * GA4 + Meta Pixel + Microsoft Clarity (each only when its ID is set), plus
 * site-wide event tracking:
 *  - whatsapp_click: any wa.me link or [data-track="whatsapp_click"]
 *  - call_click:     any tel: link or [data-track="call_click"]
 *  - showreel_play / other [data-track] elements
 *  - form_submit:    fired by the enquiry form on success (lib/track.ts)
 */
export function Analytics() {
  const pathname = usePathname();
  const firstView = useRef(true);

  // Meta Pixel PageView on client-side navigation (GA4 enhanced measurement and Clarity track history changes themselves).
  useEffect(() => {
    if (firstView.current) {
      firstView.current = false;
      return;
    }
    (window as Window & { fbq?: (...a: unknown[]) => void }).fbq?.("track", "PageView");
  }, [pathname]);

  // One delegated listener for all tracked clicks.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const el = (e.target as Element | null)?.closest<HTMLElement>("a, button, [data-track]");
      if (!el) return;
      const href = el instanceof HTMLAnchorElement ? el.href : "";
      const explicit = el.dataset.track;
      const event =
        explicit ?? (href.startsWith("https://wa.me/") ? "whatsapp_click" : href.startsWith("tel:") ? "call_click" : null);
      if (!event) return;
      track(event, {
        link_url: href || undefined,
        link_text: el.textContent?.trim().slice(0, 60) || el.getAttribute("aria-label") || undefined,
        page_path: window.location.pathname,
      });
    }
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return (
    <>
      {GA4 && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA4}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA4}');`}
          </Script>
        </>
      )}
      {PIXEL && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL}');fbq('track','PageView');`}
        </Script>
      )}
      {CLARITY && (
        <Script id="clarity" strategy="lazyOnload">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY}");`}
        </Script>
      )}
    </>
  );
}
