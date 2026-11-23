"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useFinePointer } from "@/lib/hooks";
import type { Service } from "@/lib/sanity/types";
import { videoSrc } from "@/lib/video";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { CoverMedia } from "@/components/ui/CoverMedia";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import { ArrowIcon } from "@/components/ui/Icons";
import { TransitionLink } from "@/components/layout/TransitionLink";

/** Pinned horizontal scroll of the 8 services on desktop; a vertical stack on mobile. */
export function ServicesScroll({ services }: { services: Service[] }) {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Scoped so selectors still resolve when matchMedia re-runs on resize.
      const mm = gsap.matchMedia(root.current ?? undefined);
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const el = track.current;
        if (!el) return;
        const distance = () => el.scrollWidth - window.innerWidth;
        gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            pin: true,
            scrub: 1,
            start: "top top",
            end: () => `+=${distance()}`,
            invalidateOnRefresh: true,
          },
        });
        gsap.fromTo(
          ".services-progress",
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${distance()}`, scrub: true },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative overflow-hidden border-t border-hairline lg:h-svh" aria-labelledby="services-title">
      <div className="flex h-full flex-col justify-center py-24 lg:py-0">
        <div className="container-cinema flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel>What We Do</SectionLabel>
            <h2 id="services-title" className="mt-6 font-display text-[44px] leading-[0.95] font-light md:text-7xl">
              Services crafted <em className="text-gold-soft">for every story.</em>
            </h2>
          </div>
          <TransitionLink href="/services" className="label inline-flex min-h-11 items-center gap-3 text-ivory hover:text-gold">
            All services <ArrowIcon className="h-4 w-4" />
          </TransitionLink>
        </div>

        <div
          ref={track}
          className="mt-12 flex flex-col gap-10 px-5 md:px-10 lg:mt-16 lg:w-max lg:flex-row lg:gap-8 lg:pr-[10vw] lg:pl-16"
        >
          {services.map((s, i) => (
            <ServiceCard key={s._id} service={s} index={i} />
          ))}
        </div>

        <div className="container-cinema mt-12 hidden lg:block">
          <div className="h-px w-full bg-ivory/10">
            <div className="services-progress h-px origin-left bg-gold" />
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const fine = useFinePointer();
  const [hover, setHover] = useState(false);
  const preview = videoSrc(service.previewVideo);

  return (
    <TransitionLink
      href={`/services#${service.slug}`}
      data-cursor="view"
      onPointerEnter={() => fine && setHover(true)}
      onPointerLeave={() => setHover(false)}
      className="group block w-full shrink-0 lg:w-[30vw] xl:w-[26vw]"
    >
      <div className="relative aspect-4/5 overflow-hidden bg-charcoal">
        <div className="absolute inset-0 transition-transform duration-[1.6s] ease-expo-out group-hover:scale-105">
          <CoverMedia image={service.thumbnail} alt={service.title} variant={index} sizes="(min-width: 1024px) 30vw, 100vw" />
          {preview && hover && <VideoPlayer title={`${service.title} preview`} src={preview} background active lazy={false} />}
        </div>
        <span aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-ink via-ink/10 to-transparent" />
        <span className="label absolute top-5 left-5 text-gold">{String(index + 1).padStart(2, "0")}</span>
        <div className="absolute inset-x-5 bottom-5">
          <h3 className="font-display text-3xl leading-[1.05] font-light text-ivory md:text-4xl">{service.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-ivory/70">{service.shortLine}</p>
        </div>
      </div>
      <span className="mt-4 block h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-700 ease-expo-out group-hover:scale-x-100" />
    </TransitionLink>
  );
}
