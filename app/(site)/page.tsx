import type { Metadata } from "next";
import { homeContent, siteConfig } from "@/lib/config";
import {
  getFeaturedPortfolio,
  getPage,
  getPortfolio,
  getServices,
  getSiteSettings,
  getStats,
  getTestimonials,
} from "@/lib/sanity/fetch";
import { urlForImage } from "@/lib/sanity/image";
import { demoImage } from "@/lib/sanity/demo";
import { buildMetadata, localBusinessJsonLd, showreelJsonLd } from "@/lib/seo";
import { videoPoster } from "@/lib/video";
import { JsonLd } from "@/components/seo/JsonLd";
import { Hero } from "@/components/sections/home/Hero";
import { Ticker } from "@/components/sections/home/Ticker";
import { Manifesto } from "@/components/sections/home/Manifesto";
import { ForBrands } from "@/components/sections/home/ForBrands";
import { Numbers } from "@/components/sections/home/Numbers";
import { ServicesScroll } from "@/components/sections/home/ServicesScroll";
import { FeaturedWork } from "@/components/sections/home/FeaturedWork";
import { Process } from "@/components/sections/home/Process";
import { Testimonials } from "@/components/sections/home/Testimonials";
import { InstagramReels } from "@/components/sections/home/InstagramReels";
import { ServiceAreas } from "@/components/sections/home/ServiceAreas";
import { FinalCta } from "@/components/sections/home/FinalCta";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("home");
  return buildMetadata({
    seo: page.seo,
    title: "REELCLICKS.IN | Cinematic Wedding & Brand Films in Maharashtra",
    description: siteConfig.description,
    path: "/",
    absoluteTitle: true,
  });
}

export default async function HomePage() {
  const [settings, page, stats, services, featured, portfolio, testimonials] = await Promise.all([
    getSiteSettings(),
    getPage("home"),
    getStats(),
    getServices(),
    getFeaturedPortfolio(),
    getPortfolio(),
    getTestimonials(),
  ]);

  const poster = urlForImage(settings.showreelPoster, 1920) ?? videoPoster(settings.showreel);
  const reels = portfolio.filter((p) => p.aspectRatio === "9:16");

  return (
    <>
      <JsonLd data={localBusinessJsonLd(settings)} />
      <JsonLd data={showreelJsonLd(settings)} />

      <Hero
        label={homeContent.heroLabel}
        intro={homeContent.heroIntro}
        handle={settings.instagramHandle}
        locations={settings.locations}
        showreel={settings.showreel}
        showreelMobile={settings.showreelMobile}
        poster={poster}
      />
      <Ticker items={homeContent.ticker} />
      <Manifesto text={page.manifesto || homeContent.manifesto} />
      <Numbers stats={stats} />
      <ForBrands
        content={homeContent.brands}
        handle={settings.instagramHandle}
        whatsapp={settings.founder.whatsapp}
        images={[demoImage("brand-cafe", "Creators filming a café reel"), demoImage("brand-food", "Filming food content on a gimbal")]}
      />
      <ServicesScroll services={services} />
      <FeaturedWork items={featured} />
      <Process steps={homeContent.process} />
      <Testimonials items={testimonials} />
      <InstagramReels
        handle={settings.instagramHandle}
        url={settings.instagramUrl}
        fallback={reels.length ? reels : portfolio}
      />
      <ServiceAreas locations={settings.locations} serviceArea={settings.serviceArea} />
      <FinalCta title={page.finalCtaTitle || homeContent.finalCtaTitle} whatsapp={settings.founder.whatsapp} />
    </>
  );
}
