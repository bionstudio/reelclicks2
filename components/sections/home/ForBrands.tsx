import { siteConfig } from "@/lib/config";
import type { SanityImage } from "@/lib/sanity/types";
import { whatsappLink } from "@/lib/utils";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { RevealText } from "@/components/ui/RevealText";
import { RevealMedia } from "@/components/ui/RevealMedia";
import { CoverMedia } from "@/components/ui/CoverMedia";
import { Button } from "@/components/ui/Button";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/Icons";

type Content = {
  label: string;
  title: string;
  titleEm: string;
  text: string;
  offers: Array<{ title: string; text: string }>;
};

/** Creator-led business promotion: collab reels, promo shoots, monthly content. */
export function ForBrands({
  content,
  handle,
  whatsapp,
  images,
}: {
  content: Content;
  handle: string;
  whatsapp: string;
  images: [SanityImage, SanityImage];
}) {
  return (
    <section className="relative overflow-hidden py-28 md:py-40" aria-labelledby="brands-title">
      <div className="container-cinema grid gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <SectionLabel>{content.label}</SectionLabel>
          <RevealText as="h2" className="mt-6 font-display text-[13vw] leading-[0.9] sm:text-7xl xl:text-[120px]">
            <span id="brands-title">
              {content.title} <em className="text-red">{content.titleEm}</em>
            </span>
          </RevealText>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-paper/70">{content.text}</p>

          <ol className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-hairline bg-hairline sm:grid-cols-3">
            {content.offers.map((o, i) => (
              <li key={o.title} className="flex flex-col bg-ink p-6 md:p-7">
                <span className="label text-red">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-6 font-display text-2xl font-semibold">{o.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-paper/60">{o.text}</p>
              </li>
            ))}
          </ol>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button
              href={whatsappLink(whatsapp, siteConfig.whatsappMessages.promote)}
              newTab
              size="lg"
              data-track="whatsapp_click"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Promote My Business
            </Button>
            <Button href="/portfolio?category=brand-promotional" variant="outline" size="lg">
              See Brand Work
            </Button>
          </div>
        </div>

        {/* Phone-style reel previews */}
        <div className="relative mx-auto w-full max-w-md lg:col-span-5 lg:mt-24">
          <RevealMedia className="z-10 ml-auto w-[72%] overflow-hidden rounded-[2rem] border-[6px] border-surface shadow-2xl shadow-black/40">
            <div className="relative aspect-9/16">
              <CoverMedia image={images[0]} alt={images[0].alt ?? "Brand reel"} sizes="(min-width: 1024px) 24vw, 70vw" />
              <div className="theme-dark absolute inset-x-0 top-0 flex items-center gap-2 bg-linear-to-b from-black/70 to-transparent p-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red text-black">
                  <InstagramIcon className="h-4 w-4" />
                </span>
                <span className="text-sm font-semibold text-paper">{handle}</span>
                <span className="label ml-auto rounded-full bg-paper/15 px-2 py-1 text-[0.6rem] text-paper">Collab</span>
              </div>
              <div className="theme-dark absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 to-transparent p-4 pt-16">
                <p className="text-sm font-semibold text-paper">Your café. Your launch. Our feed.</p>
                <span className="mt-3 block h-1 overflow-hidden rounded-full bg-paper/25">
                  <span className="block h-full w-2/3 rounded-full bg-red" />
                </span>
              </div>
            </div>
          </RevealMedia>
          <div className="absolute bottom-[-8%] left-0 z-20 w-[46%]">
            <RevealMedia delay={0.15} className="rounded-[1.5rem] border-[5px] border-surface shadow-2xl shadow-black/40">
              <div className="relative aspect-9/16">
                <CoverMedia image={images[1]} alt={images[1].alt ?? "Behind the scenes"} sizes="(min-width: 1024px) 16vw, 45vw" />
              </div>
            </RevealMedia>
          </div>
          <span className="label absolute -top-4 -left-2 z-30 -rotate-6 rounded-full bg-red px-4 py-2 text-black shadow-lg md:-left-6">
            ● Now booking collabs
          </span>
        </div>
      </div>
    </section>
  );
}
