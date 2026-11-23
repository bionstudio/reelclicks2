import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { TransitionProvider } from "@/components/layout/PageTransition";
import { Preloader } from "@/components/layout/Preloader";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { MobileBar } from "@/components/layout/MobileBar";
import { DeferredExtras } from "@/components/layout/DeferredExtras";
import { getSiteSettings, getCityPages } from "@/lib/sanity/fetch";

/** Website chrome: preloader, header, footer, floating CTAs, cursor, smooth scroll. */
export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const [settings, cities] = await Promise.all([getSiteSettings(), getCityPages()]);

  return (
    <>
      <a
        href="#main"
        className="label sr-only z-120 bg-gold px-4 py-3 text-ink focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        Skip to content
      </a>
      <SmoothScroll />
      <TransitionProvider>
        <Preloader />
        <Header />
        <main id="main" className="flex flex-1 flex-col">
          {children}
        </main>
        <Footer settings={settings} cities={cities} />
        <WhatsAppFloat />
        <MobileBar />
      </TransitionProvider>
      <DeferredExtras />
      <div aria-hidden="true" className="film-grain" />
    </>
  );
}
