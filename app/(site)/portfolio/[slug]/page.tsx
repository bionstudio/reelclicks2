import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortableText } from "next-sanity";
import { getPortfolio, getPortfolioItem, getPortfolioSlugs, getSiteSettings } from "@/lib/sanity/fetch";
import { urlForImage } from "@/lib/sanity/image";
import { breadcrumbJsonLd, buildMetadata, portfolioVideoJsonLd } from "@/lib/seo";
import { videoPoster, videoSrc } from "@/lib/video";
import { whatsappLink } from "@/lib/utils";
import { JsonLd } from "@/components/seo/JsonLd";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { RevealText } from "@/components/ui/RevealText";
import { RevealMedia } from "@/components/ui/RevealMedia";
import { CoverMedia } from "@/components/ui/CoverMedia";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import { Button } from "@/components/ui/Button";
import { ArrowIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { TransitionLink } from "@/components/layout/TransitionLink";

export async function generateStaticParams() {
  const slugs = await getPortfolioSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/portfolio/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPortfolioItem(slug);
  if (!item) return {};
  return buildMetadata({
    seo: item.seo,
    title: `${item.title} — ${item.category.title} Film${item.location ? ` in ${item.location}` : ""}`,
    description: item.story || `${item.title}: a ${item.category.title.toLowerCase()} film by REELCLICKS.IN.`,
    path: `/portfolio/${item.slug}`,
  });
}

const formatDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString("en-IN", { month: "long", year: "numeric", timeZone: "Asia/Kolkata" }) : null;

export default async function CaseStudyPage({ params }: PageProps<"/portfolio/[slug]">) {
  const { slug } = await params;
  const [item, all, settings] = await Promise.all([getPortfolioItem(slug), getPortfolio(), getSiteSettings()]);
  if (!item) notFound();

  const idx = all.findIndex((p) => p.slug === item.slug);
  const next = all.length > 1 ? all[(idx + 1) % all.length] : null;
  const src = videoSrc(item.video);
  const poster = urlForImage(item.thumbnail, 1920) ?? videoPoster(item.video);
  const vertical = item.aspectRatio === "9:16";
  const bts = item.bts?.length ? item.bts : Array.from({ length: 4 }, () => null);
  const meta = [
    ["Category", item.category.title],
    ["Location", item.location],
    ["Date", formatDate(item.date)],
    ["Client", item.client],
  ].filter(([, v]) => v) as Array<[string, string]>;

  return (
    <>
      <JsonLd data={portfolioVideoJsonLd(item)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Portfolio", path: "/portfolio" },
          { name: item.title, path: `/portfolio/${item.slug}` },
        ])}
      />

      {/* Hero */}
      <section className="container-cinema pt-36 pb-14 md:pt-48 md:pb-20">
        <nav aria-label="Breadcrumb" className="label flex items-center gap-3 text-paper/60">
          <TransitionLink href="/portfolio" className="min-h-11 py-3 hover:text-red">
            Portfolio
          </TransitionLink>
          <span aria-hidden="true">/</span>
          <TransitionLink href={`/portfolio?category=${item.category.slug}`} className="min-h-11 py-3 hover:text-red">
            {item.category.title}
          </TransitionLink>
        </nav>
        <RevealText
          as="h1"
          trigger="mount"
          className="mt-6 max-w-6xl font-display text-[52px] leading-[0.92] text-paper md:text-[110px] xl:text-[140px]"
        >
          {item.title}
        </RevealText>
        <dl className="mt-12 grid grid-cols-2 gap-6 border-t border-hairline pt-8 md:grid-cols-4">
          {meta.map(([k, v]) => (
            <div key={k}>
              <dt className="label text-red">{k}</dt>
              <dd className="mt-2 text-paper/90">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Final film */}
      <section aria-label="The film" className="bg-ink">
        <div className={vertical ? "container-cinema flex justify-center" : "container-cinema"}>
          <RevealMedia className={vertical ? "aspect-9/16 w-full max-w-md" : "aspect-video w-full"}>
            <div className="relative h-full w-full" data-cursor="play">
              <VideoPlayer title={item.title} src={src} poster={poster} controls lazy fit="cover" />
              {!src && (
                <p className="label pointer-events-none absolute inset-x-0 bottom-6 text-center text-paper/60">Film coming soon</p>
              )}
            </div>
          </RevealMedia>
        </div>
      </section>

      {/* Brief */}
      <section className="container-cinema grid gap-10 py-24 md:py-36 lg:grid-cols-12" aria-labelledby="brief-title">
        <div className="lg:col-span-4">
          <SectionLabel as="h2">
            <span id="brief-title">The Brief</span>
          </SectionLabel>
        </div>
        <div className="space-y-6 font-display text-2xl leading-[1.35] text-paper/90 md:text-[34px] lg:col-span-8">
          {item.brief?.length ? (
            <PortableText value={item.brief} />
          ) : (
            <p>{item.story || "The full story behind this film is coming soon."}</p>
          )}
        </div>
      </section>

      {/* Behind the scenes */}
      <section className="border-t border-hairline py-24 md:py-36" aria-labelledby="bts-title">
        <div className="container-cinema">
          <SectionLabel as="h2">
            <span id="bts-title">Behind The Scenes</span>
          </SectionLabel>
          <ul className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-12 md:gap-6">
            {bts.map((img, i) => (
              <li
                key={i}
                className={
                  i % 4 === 0
                    ? "col-span-2 md:col-span-7"
                    : i % 4 === 1
                      ? "md:col-span-5"
                      : i % 4 === 2
                        ? "md:col-span-4"
                        : "md:col-span-8"
                }
              >
                <RevealMedia className={i % 4 === 1 ? "aspect-4/5 md:aspect-auto md:h-full" : "aspect-video"} delay={(i % 2) * 0.1}>
                  <div className="relative h-full w-full">
                    <CoverMedia
                      image={img}
                      alt={img?.alt || `Behind the scenes of ${item.title}`}
                      variant={i + 1}
                      sizes="(min-width: 768px) 50vw, 100vw"
                    />
                  </div>
                </RevealMedia>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Testimonial */}
      {item.testimonial && (
        <section className="border-t border-hairline py-24 md:py-36" aria-label="Client testimonial">
          <figure className="container-cinema max-w-5xl text-center">
            <p aria-hidden="true" className="font-display text-8xl leading-none text-red/40">
              &ldquo;
            </p>
            <blockquote className="font-display text-3xl leading-[1.2] text-paper italic md:text-5xl">
              {item.testimonial.quote}
            </blockquote>
            <figcaption className="mt-8">
              <span className="block text-paper">{item.testimonial.name}</span>
              <span className="label mt-2 block text-paper/60">
                {[item.testimonial.eventType, item.testimonial.city].filter(Boolean).join(" · ")}
              </span>
            </figcaption>
          </figure>
        </section>
      )}

      {/* CTA */}
      <section className="border-t border-hairline py-24 md:py-32">
        <div className="container-cinema flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
          <div>
            <SectionLabel>Love this film?</SectionLabel>
            <p className="mt-6 max-w-2xl font-display text-[40px] leading-[0.95] md:text-7xl">
              Let&apos;s create <em className="text-red">yours.</em>
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              href={whatsappLink(
                settings.founder.whatsapp,
                `Hi REELCLICKS, I loved “${item.title}”. I'd like to book a similar ${item.category.title} shoot.`,
              )}
              newTab
              data-track="whatsapp_click"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Book similar shoot
            </Button>
            <Button href="/contact" variant="outline">
              Send Enquiry
            </Button>
          </div>
        </div>
      </section>

      {/* Next project */}
      {next && (
        <TransitionLink
          href={`/portfolio/${next.slug}`}
          data-cursor="view"
          className="group relative block overflow-hidden border-t border-hairline"
        >
          <div className="absolute inset-0 opacity-40 transition-opacity duration-700 group-hover:opacity-70">
            <CoverMedia image={next.thumbnail} alt="" variant={idx + 2} sizes="100vw" />
          </div>
          <div aria-hidden="true" className="absolute inset-0 bg-linear-to-r from-ink via-ink/70 to-transparent" />
          <div className="container-cinema relative flex items-end justify-between gap-6 py-24 md:py-36">
            <div>
              <p className="label text-red">Next film</p>
              <p className="mt-4 font-display text-[44px] leading-[0.95] text-paper md:text-8xl">{next.title}</p>
              <p className="label mt-4 text-paper/60">{next.category.title}</p>
            </div>
            <ArrowIcon className="h-10 w-10 shrink-0 text-red transition-transform duration-700 group-hover:translate-x-2" />
          </div>
        </TransitionLink>
      )}
    </>
  );
}
