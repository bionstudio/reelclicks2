import type { SanityImage } from "@/lib/sanity/types";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { RevealText } from "@/components/ui/RevealText";
import { RevealMedia } from "@/components/ui/RevealMedia";
import { CoverMedia } from "@/components/ui/CoverMedia";

/** Split hero: huge serif headline + slow-zoom behind-the-scenes media. */
export function AboutHero({ intro, image }: { intro: string; image?: SanityImage | null }) {
  return (
    <section className="container-cinema grid min-h-svh items-end gap-12 pt-36 pb-20 md:pt-44 lg:grid-cols-12 lg:items-center lg:pb-28">
      <div className="lg:col-span-6">
        <SectionLabel>About REELCLICKS.IN</SectionLabel>
        <RevealText
          as="h1"
          trigger="mount"
          className="mt-8 font-display text-[56px] leading-[0.9] text-paper md:text-[120px] xl:text-[164px]"
        >
          We Are
          <br />
          <em className="text-red">Storytellers.</em>
        </RevealText>
        <p className="mt-10 max-w-md text-lg leading-relaxed text-paper/60">{intro}</p>
      </div>

      <RevealMedia className="aspect-4/5 lg:col-span-5 lg:col-start-8" delay={0.3}>
        <div className="relative h-full w-full overflow-hidden">
          <div className="slow-zoom absolute inset-0">
            <CoverMedia
              image={image}
              alt="Behind the scenes with the REELCLICKS.IN crew"
              variant={1}
              priority
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
          </div>
          <span className="label absolute bottom-5 left-5 text-paper/70">Behind the lens</span>
        </div>
      </RevealMedia>
    </section>
  );
}
