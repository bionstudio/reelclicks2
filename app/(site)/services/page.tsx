import type { Metadata } from "next";
import { getFaqs, getPage, getPortfolio, getServices, getSiteSettings } from "@/lib/sanity/fetch";
import type { PortfolioItem, Service } from "@/lib/sanity/types";
import { breadcrumbJsonLd, buildMetadata, faqJsonLd, servicesJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { RevealText } from "@/components/ui/RevealText";
import { ServiceIndex } from "@/components/sections/services/ServiceIndex";
import { ServiceSection } from "@/components/sections/services/ServiceSection";
import { FaqAccordion } from "@/components/sections/services/FaqAccordion";
import { FinalCta } from "@/components/sections/home/FinalCta";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("services");
  return buildMetadata({
    seo: page.seo,
    title: "Wedding, Brand & Event Video Services | REELCLICKS.IN",
    description:
      "Professional wedding shoots, cinematic reels, brand films, corporate and event coverage across Maharashtra — Nashik, Malegaon, Manmad, Nandgaon and beyond.",
    path: "/services",
    absoluteTitle: true,
  });
}

/** Up to 3 films from the service's category; reels-type services show vertical reels first. */
function worksFor(service: Service, portfolio: PortfolioItem[]) {
  if (!service.categorySlug) return [];
  const prefersReels = /reel|social/i.test(service.slug);
  return portfolio
    .filter((p) => p.category?.slug === service.categorySlug)
    .sort((a, b) => {
      const score = (p: PortfolioItem) => (p.aspectRatio === "9:16") === prefersReels ? 0 : 1;
      return score(a) - score(b);
    })
    .slice(0, 3);
}

export default async function ServicesPage() {
  const [services, portfolio, faqs, settings] = await Promise.all([
    getServices(),
    getPortfolio(),
    getFaqs(),
    getSiteSettings(),
  ]);
  const index = services.map((s) => ({ slug: s.slug, title: s.title }));

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }])} />
      <JsonLd data={servicesJsonLd(services)} />
      <JsonLd data={faqJsonLd(faqs)} />

      <section className="container-cinema pt-40 pb-20 md:pt-52 md:pb-28">
        <SectionLabel>Our Services</SectionLabel>
        <RevealText
          as="h1"
          trigger="mount"
          className="mt-8 max-w-6xl font-display text-[52px] leading-[0.92] text-paper md:text-[110px] xl:text-[150px]"
        >
          Films crafted
          <br />
          <em className="text-red">for every story.</em>
        </RevealText>
        <p className="mt-10 max-w-xl text-lg leading-relaxed text-paper/60">
          From wedding films to brand campaigns — {services.length} ways we turn your moments into cinema, anywhere in
          Maharashtra.
        </p>
      </section>

      <div className="container-cinema">
        <ServiceIndex items={index} variant="bar" />
        <div className="grid lg:grid-cols-12 lg:gap-12">
          <aside className="hidden lg:col-span-3 lg:block">
            <div className="h-full pt-32">
              <ServiceIndex items={index} variant="side" />
            </div>
          </aside>
          <div className="lg:col-span-9">
            {services.map((s, i) => (
              <ServiceSection
                key={s._id}
                service={s}
                index={i}
                total={services.length}
                works={worksFor(s, portfolio)}
                whatsapp={settings.founder.whatsapp}
              />
            ))}
          </div>
        </div>
      </div>

      <section id="faq" className="theme-light scroll-mt-28 py-28 md:py-40" aria-labelledby="faq-title">
        <div className="container-cinema grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionLabel>FAQ</SectionLabel>
            <h2 id="faq-title" className="mt-6 font-display text-[44px] leading-[0.95] md:text-6xl">
              Questions, <em className="text-red">answered.</em>
            </h2>
            <p className="mt-6 max-w-sm text-paper/60">
              Can&apos;t find what you&apos;re looking for? Message us on WhatsApp — we reply within 2 hours.
            </p>
          </div>
          <div className="lg:col-span-8">
            <FaqAccordion items={faqs} />
          </div>
        </div>
      </section>

      <FinalCta title="Let's plan your shoot." whatsapp={settings.founder.whatsapp} />
    </>
  );
}
