import Image from "next/image";
import { getInstagramPosts } from "@/lib/instagram";
import type { PortfolioItem } from "@/lib/sanity/types";
import { CoverMedia } from "@/components/ui/CoverMedia";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";
import { InstagramIcon } from "@/components/ui/Icons";

type Tile = { key: string; href: string; label: string; image?: string; item?: PortfolioItem; variant: number };

/** "Follow the story" — 9:16 reels marquee. Behold feed when connected, otherwise placeholders. */
export async function InstagramReels({
  handle,
  url,
  fallback,
}: {
  handle: string;
  url: string;
  fallback: PortfolioItem[];
}) {
  const posts = await getInstagramPosts();

  const tiles: Tile[] = posts.length
    ? posts.map((p, i) => ({ key: p.id, href: p.permalink, label: p.caption?.slice(0, 80) || `Instagram post ${i + 1}`, image: p.image, variant: i }))
    : Array.from({ length: 8 }, (_, i) => {
        const item = fallback[i % Math.max(fallback.length, 1)];
        return { key: `ph-${i}`, href: url, label: item ? `${item.title} on Instagram` : "Instagram reel", item, variant: i + 2 };
      });

  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 gap-4 pr-4 md:gap-6 md:pr-6" aria-hidden={hidden || undefined}>
      {tiles.map((t) => (
        <li key={`${hidden ? "b" : "a"}-${t.key}`} className="w-[46vw] shrink-0 sm:w-[30vw] md:w-[220px] lg:w-[250px]">
          <a
            href={t.href}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={hidden ? -1 : undefined}
            aria-label={t.label}
            data-cursor="view"
            className="group relative block aspect-9/16 overflow-hidden bg-charcoal"
          >
            <div className="absolute inset-0 transition-transform duration-[1.4s] ease-expo-out group-hover:scale-105">
              {t.image ? (
                <Image src={t.image} alt="" fill sizes="250px" className="object-cover" />
              ) : (
                <CoverMedia image={t.item?.thumbnail} alt="" variant={t.variant} sizes="250px" />
              )}
            </div>
            <span aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-ink/60 to-transparent" />
            <InstagramIcon className="absolute right-3 bottom-3 h-5 w-5 text-ivory/80 transition-colors group-hover:text-gold" />
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <section className="cv-auto overflow-hidden border-t border-hairline py-28 md:py-40" aria-labelledby="instagram-title">
      <div className="container-cinema flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <SectionLabel>Instagram</SectionLabel>
          <h2 id="instagram-title" className="mt-6 font-display text-[44px] leading-[0.95] font-light md:text-7xl">
            Follow the story <em className="text-gold-soft">{handle}</em>
          </h2>
        </div>
        <Button href={url} newTab variant="outline">
          <InstagramIcon className="h-4 w-4" />
          Follow on Instagram
        </Button>
      </div>

      <div className="marquee mt-14 flex w-max md:mt-20">
        <div className="marquee-track flex">
          {row(false)}
          {row(true)}
        </div>
      </div>
    </section>
  );
}
