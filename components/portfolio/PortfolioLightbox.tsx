"use client";

import { useCallback, useState } from "react";
import { Lightbox } from "@/components/ui/Lightbox";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { urlForImage } from "@/lib/sanity/image";
import type { PortfolioItem } from "@/lib/sanity/types";
import { videoPoster, videoSrc } from "@/lib/video";
import { cn, whatsappLink } from "@/lib/utils";

type Props = {
  items: PortfolioItem[];
  index: number | null;
  onChange: (index: number | null) => void;
  /** Link to the /portfolio/[slug] case study (off on the case study page itself). */
  showStoryLink?: boolean;
};

const formatDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString("en-IN", { month: "long", year: "numeric" }) : null;

/** Full-screen film player with details, prev/next, share and a booking CTA. */
export function PortfolioLightbox({ items, index, onChange, showStoryLink = true }: Props) {
  const item = index === null ? null : items[index];
  const [copied, setCopied] = useState(false);

  const close = useCallback(() => onChange(null), [onChange]);
  const step = useCallback(
    (d: number) => {
      if (index === null) return;
      onChange((index + d + items.length) % items.length);
    },
    [index, items.length, onChange],
  );
  const prev = useCallback(() => step(-1), [step]);
  const next = useCallback(() => step(1), [step]);

  async function share() {
    if (!item) return;
    const url = `${window.location.origin}/portfolio/${item.slug}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: item.title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* user cancelled */
    }
  }

  const multiple = items.length > 1;
  const src = item ? videoSrc(item.video) : undefined;
  const poster = item ? (urlForImage(item.thumbnail, 1920) ?? videoPoster(item.video)) : undefined;
  const vertical = item?.aspectRatio === "9:16";

  return (
    <Lightbox
      open={item !== null}
      onClose={close}
      onPrev={multiple ? prev : undefined}
      onNext={multiple ? next : undefined}
      label={item ? `${item.title} — ${item.category.title}` : ""}
      footer={
        item && (
          <div className="mx-auto grid max-h-[32vh] max-w-6xl gap-6 overflow-y-auto md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <h2 className="font-display text-3xl leading-none md:text-5xl">{item.title}</h2>
              <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm">
                {[
                  ["Category", item.category.title],
                  ["Location", item.location],
                  ["Date", formatDate(item.date)],
                  ["Client", item.client],
                ]
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <div key={k}>
                      <dt className="label text-red">{k}</dt>
                      <dd className="mt-1 text-paper/90">{v}</dd>
                    </div>
                  ))}
              </dl>
              {item.story && <p className="mt-4 max-w-2xl text-sm leading-relaxed text-paper/60">{item.story}</p>}
            </div>
            <div className="flex flex-wrap gap-3 md:col-span-5 md:justify-end">
              {showStoryLink && (
                <Button variant="ghost" size="sm" href={`/portfolio/${item.slug}`} magnetic={false}>
                  Full story →
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={share} magnetic={false}>
                {copied ? "Link copied" : "Share"}
              </Button>
              <Button
                size="sm"
                magnetic={false}
                newTab
                data-track="whatsapp_click"
                href={whatsappLink(
                  undefined,
                  `Hi REELCLICKS, I loved “${item.title}”. I'd like to book a similar ${item.category.title} shoot.`,
                )}
              >
                <WhatsAppIcon className="h-4 w-4" />
                Book similar shoot
              </Button>
            </div>
          </div>
        )
      }
    >
      {item && (
        <div className={cn("relative", vertical ? "aspect-9/16 h-full max-h-full" : "aspect-video w-full max-w-6xl")}>
          <VideoPlayer
            key={item._id}
            title={item.title}
            src={src}
            poster={poster}
            controls
            autoPlay
            lazy={false}
            fit="contain"
          />
          {!src && (
            <p className="label pointer-events-none absolute inset-x-0 bottom-6 text-center text-paper/60">
              Film coming soon
            </p>
          )}
        </div>
      )}
    </Lightbox>
  );
}
