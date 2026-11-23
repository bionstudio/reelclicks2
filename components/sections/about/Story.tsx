import { PortableText, type PortableTextComponents } from "next-sanity";
import type { PortableTextBlock } from "@/lib/sanity/types";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { RevealText } from "@/components/ui/RevealText";

const components: PortableTextComponents = {
  block: { normal: ({ children }) => <p>{children}</p> },
};

/** Editorial two-column story with a gold drop-cap (Sanity → Pages → About → Our story). */
export function Story({ blocks, fallback }: { blocks?: PortableTextBlock[] | null; fallback: string[] }) {
  return (
    <section className="border-t border-hairline py-28 md:py-44" aria-labelledby="story-title">
      <div className="container-cinema grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionLabel>Our Story</SectionLabel>
          <RevealText as="h2" className="mt-6 font-display text-[40px] leading-[0.95] font-light md:text-6xl">
            <span id="story-title">
              Born in North Maharashtra. <em className="text-gold-soft">Made for every story.</em>
            </span>
          </RevealText>
        </div>
        <div className="drop-cap gap-16 space-y-6 text-lg leading-relaxed text-ivory/80 md:columns-2 lg:col-span-8 [&>p]:break-inside-avoid">
          {blocks?.length ? (
            <PortableText value={blocks} components={components} />
          ) : (
            fallback.map((p) => <p key={p.slice(0, 24)}>{p}</p>)
          )}
        </div>
      </div>
    </section>
  );
}
