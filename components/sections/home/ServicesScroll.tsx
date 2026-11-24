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
    <section ref={root} className="theme-light relative overflow-hidden lg:h-svh" aria-labelledby="services-title">
      <div className="flex h-full flex-col justify-center py-24 lg:py-0">
        <div className="container-cinema flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel>What We Do</SectionLabel>
            <h2 id="services-title" className="mt-6 font-display text-[44px] leading-[0.92] md:text-7xl xl:text-8xl">
              Services crafted <em className="text-red">for every story.</em>
            </h2>
          </div>
          <TransitionLink href="/services" className="inline-flex min-h-11 shrink-0 items-center gap-3 self-start rounded-full border whitespace-nowrap md:self-auto border-hairline px-5 text-sm font-semibold text-paper transition-colors hover:border-paper hover:bg-paper hover:text-ink">
            All services <ArrowIcon className="h-4 w-4" />
          </TransitionLink>
        </div>

        <div
          ref={track}
          className="mt-12 flex flex-col gap-10 px-5 md:px-10 lg:mt-16 lg:w-max lg:flex-row lg:gap-8 lg:pr-[10vw] lg:pl-16 motion-reduce:lg:w-auto motion-reduce:lg:overflow-x-auto motion-reduce:lg:pb-4"
        >
          {services.map((s, i) => (
            <ServiceCard key={s._id} service={s} index={i} />
          ))}
        </div>

        <div className="container-cinema mt-12 hidden lg:block">
          <div className="h-1 w-full overflow-hidden rounded-full bg-paper/10">
            <div className="services-progress h-full origin-left rounded-full bg-red" />
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
      <div className="theme-dark relative aspect-4/5 overflow-hidden rounded-3xl bg-surface">
        <div className="absolute inset-0 transition-transform duration-[1.6s] ease-expo-out group-hover:scale-105">
          <CoverMedia image={service.thumbnail} alt={service.title} variant={index} sizes="(min-width: 1024px) 30vw, 100vw" />
          {preview && hover && <VideoPlayer title={`${service.title} preview`} src={preview} background active lazy={false} />}
        </div>
        <span aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />
        <span className="label absolute top-5 left-5 rounded-full bg-black/50 px-3 py-1.5 text-paper backdrop-blur">{String(index + 1).padStart(2, "0")}</span>
        <span aria-hidden="true" className="absolute top-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-red text-black transition-transform duration-500 group-hover:-rotate-45">
          <ArrowIcon className="h-4 w-4" />
        </span>
        <div className="absolute inset-x-5 bottom-5">
          <h3 className="font-display text-3xl leading-[1] font-semibold text-paper md:text-4xl">{service.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-paper/70">{service.shortLine}</p>
        </div>
      </div>
    </TransitionLink>
  );
}
