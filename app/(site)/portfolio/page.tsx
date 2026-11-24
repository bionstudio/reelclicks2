import type { Metadata } from "next";
import { getCategories, getPage, getPortfolio } from "@/lib/sanity/fetch";
import { breadcrumbJsonLd, buildMetadata, portfolioListJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { RevealText } from "@/components/ui/RevealText";
import { PortfolioGallery } from "@/components/portfolio/PortfolioGallery";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("portfolio");
  return buildMetadata({
    seo: page.seo,
    title: "Portfolio | Wedding Films & Brand Videos | REELCLICKS.IN",
    description:
      "Watch our wedding films, cinematic reels, brand, corporate and event videos from across Maharashtra — Nashik, Malegaon, Manmad, Nandgaon and beyond.",
    path: "/portfolio",
    absoluteTitle: true,
  });
}

export default async function PortfolioPage() {
  const [items, categories] = await Promise.all([getPortfolio(), getCategories()]);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Portfolio", path: "/portfolio" }])} />
      <JsonLd data={portfolioListJsonLd(items)} />

      <section className="container-cinema pt-40 pb-16 md:pt-52 md:pb-24">
        <SectionLabel>Our Work</SectionLabel>
        <RevealText
          as="h1"
          trigger="mount"
          className="mt-8 max-w-6xl font-display text-[52px] leading-[0.92] text-paper md:text-[110px] xl:text-[150px]"
        >
          Films that feel
          <br />
          <em className="text-red">like memories.</em>
        </RevealText>
        <p className="mt-10 max-w-xl text-lg leading-relaxed text-paper/60">
          Weddings, brands, events and journeys — a few of the stories we&apos;ve had the honour of telling.
        </p>
      </section>

      <div className="container-cinema pb-28 md:pb-40">
        <PortfolioGallery items={items} categories={categories} />
      </div>
    </>
  );
}
