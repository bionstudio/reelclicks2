import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortableText } from "next-sanity";
import { services, siteConfig } from "@/lib/config";
import { getCityPage, getCityPages, getFeaturedPortfolio, getSiteSettings } from "@/lib/sanity/fetch";
import { breadcrumbJsonLd, buildMetadata, cityServiceJsonLd } from "@/lib/seo";
import { whatsappLink } from "@/lib/utils";
import { JsonLd } from "@/components/seo/JsonLd";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { RevealText } from "@/components/ui/RevealText";
import { Button } from "@/components/ui/Button";
import { ArrowIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { TransitionLink } from "@/components/layout/TransitionLink";
import { ServiceWorks } from "@/components/sections/services/ServiceWorks";
import { FinalCta } from "@/components/sections/home/FinalCta";

/**
 * Local landing pages from Sanity → City Pages, e.g. /wedding-cinematographer-nashik.
 * Unknown slugs 404.
 */
export async function generateStaticParams() {
  const cities = await getCityPages();
  return cities.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[city]">): Promise<Metadata> {
  const { city: slug } = await params;
  const page = await getCityPage(slug);
  if (!page) return {};
  return buildMetadata({
    seo: page.seo,
    title: `Wedding Cinematographer in ${page.city} | REELCLICKS.IN`,
    description: page.intro || `Cinematic wedding films and reels in ${page.city}, Maharashtra by REELCLICKS.IN.`,
    path: `/${page.slug}`,
    absoluteTitle: true,
  });
}

export default async function CityLandingPage({ params }: PageProps<"/[city]">) {
  const { city: slug } = await params;
  const [page, featured, settings, cities] = await Promise.all([
    getCityPage(slug),
    getFeaturedPortfolio(),
    getSiteSettings(),
    getCityPages(),
  ]);
  if (!page) notFound();

  // City films first, topped up with featured work so the section is never empty.
  const cityFilms = page.portfolio?.filter(Boolean) ?? [];
  const films = [...cityFilms, ...featured.filter((f) => !cityFilms.some((c) => c._id === f._id))].slice(0, 3);
  const otherCities = cities.filter((c) => c.slug !== page.slug);
  const waText = `Hi REELCLICKS, I'm looking for a wedding cinematographer in ${page.city}. My date is: `;

  return (
    <>
      <JsonLd
        data={cityServiceJsonLd(page.city, page.slug, page.intro || `Wedding cinematography in ${page.city}`)}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: `Wedding Cinematographer in ${page.city}`, path: `/${page.slug}` },
        ])}
      />

      {/* Hero */}
      <section className="container-cinema pt-40 pb-20 md:pt-52 md:pb-28">
        <SectionLabel>{page.city} · Maharashtra</SectionLabel>
        <RevealText
          as="h1"
          trigger="mount"
          className="mt-8 max-w-6xl font-display text-[48px] leading-[0.92] text-paper md:text-[100px] xl:text-[136px]"
        >
          {page.headline || `Wedding Cinematographer in ${page.city}`}
        </RevealText>
        {page.intro && <p className="mt-10 max-w-2xl text-lg leading-relaxed text-paper/60">{page.intro}</p>}
        <div className="mt-12 flex flex-wrap gap-4">
          <Button href={whatsappLink(settings.founder.whatsapp, waText)} newTab size="lg" data-track="whatsapp_click">
            <WhatsAppIcon className="h-4 w-4" />
            Check Date Availability
          </Button>
          <Button href="/contact?service=wedding-shoots" variant="outline" size="lg">
            Send Enquiry
          </Button>
        </div>
      </section>

      {/* Unique local copy */}
      {page.body?.length ? (
        <section className="theme-light py-24 md:py-36" aria-labelledby="city-story">
          <div className="container-cinema grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionLabel as="h2">
                <span id="city-story">Filming in {page.city}</span>
              </SectionLabel>
            </div>
            <div className="drop-cap space-y-6 text-lg leading-relaxed text-paper/80 lg:col-span-8 [&>p]:max-w-3xl">
              <PortableText value={page.body} />
            </div>
          </div>
        </section>
      ) : null}

      {/* Films */}
      {films.length > 0 && (
        <section className="border-t border-hairline py-24 md:py-36" aria-labelledby="city-films">
          <div className="container-cinema grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionLabel>Our Work</SectionLabel>
              <h2 id="city-films" className="mt-6 font-display text-[40px] leading-[0.95] md:text-6xl">
                {cityFilms.length ? (
                  <>
                    Films from <em className="text-red">{page.city}.</em>
                  </>
                ) : (
                  <>
                    Recent <em className="text-red">films.</em>
                  </>
                )}
              </h2>
              <div className="mt-8">
                <Button href="/portfolio" variant="ghost">
                  View full portfolio →
                </Button>
              </div>
            </div>
            <div className="lg:col-span-8">
              <ServiceWorks items={films} />
            </div>
          </div>
        </section>
      )}

      {/* Services + other cities (internal links) */}
      <section className="border-t border-hairline py-24 md:py-36" aria-label={`Services in ${page.city}`}>
        <div className="container-cinema grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionLabel as="h2">Services in {page.city}</SectionLabel>
            <ul className="mt-8 border-t border-hairline">
              {services.map((s, i) => (
                <li key={s.slug} className="border-b border-hairline">
                  <TransitionLink
                    href={`/services#${s.slug}`}
                    className="group flex min-h-16 items-center justify-between gap-6 py-4"
                  >
                    <span className="flex items-baseline gap-5">
                      <span className="label text-red">{String(i + 1).padStart(2, "0")}</span>
                      <span className="font-display text-2xl text-paper transition-colors group-hover:text-red md:text-3xl">
                        {s.title}
                      </span>
                    </span>
                    <ArrowIcon className="h-5 w-5 shrink-0 text-paper/60 transition-all group-hover:translate-x-1 group-hover:text-red" />
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </div>
          {otherCities.length > 0 && (
            <div className="lg:col-span-4 lg:col-start-9">
              <SectionLabel as="h2">Also Filming In</SectionLabel>
              <ul className="mt-8 space-y-2">
                {otherCities.map((c) => (
                  <li key={c.slug}>
                    <TransitionLink href={`/${c.slug}`} className="footer-link text-lg">
                      Wedding cinematographer in {c.city}
                    </TransitionLink>
                  </li>
                ))}
                <li className="pt-4 text-sm text-paper/60">…and {siteConfig.serviceArea.toLowerCase()}.</li>
              </ul>
            </div>
          )}
        </div>
      </section>

      <FinalCta title={`Your ${page.city} story deserves a film.`} whatsapp={settings.founder.whatsapp} />
    </>
  );
}
