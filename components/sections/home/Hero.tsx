"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { onIntroDone } from "@/lib/intro";
import { prefersReducedMotion, useMediaQuery } from "@/lib/hooks";
import { videoSrc, type VideoSource } from "@/lib/video";
import { RevealText } from "@/components/ui/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import { Lightbox } from "@/components/ui/Lightbox";

type Props = {
  label: string;
  showreel?: VideoSource | null;
  showreelMobile?: VideoSource | null;
  poster?: string;
};

/** Full-screen showreel hero with letterbox bars, line-by-line headline and showreel player. */
export function Hero({ label, showreel, showreelMobile, poster }: Props) {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [streamReady, setStreamReady] = useState(false);
  const mobile = useMediaQuery("(max-width: 767px)");

  // Poster first: start streaming the background video only once the intro is done
  // and the browser is idle, so it never competes with the first paint (LCP).
  useEffect(() => {
    let idle: number | undefined;
    const unsubscribe = onIntroDone(() => {
      const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 600));
      idle = ric(() => setStreamReady(true));
    });
    return () => {
      unsubscribe();
      if (idle !== undefined) (window.cancelIdleCallback ?? window.clearTimeout)(idle);
    };
  }, []);

  const full = videoSrc(showreel);
  const background = mobile ? (videoSrc(showreelMobile) ?? full) : full;

  useGSAP(
    () => {
      // Resolve elements now: the intro callback runs later, outside this scoped context.
      const fades = gsap.utils.toArray<HTMLElement>(".hero-fade", root.current);
      if (prefersReducedMotion()) {
        gsap.set(fades, { autoAlpha: 1 });
        return;
      }
      gsap.set(fades, { autoAlpha: 0, y: 24 });
      const unsubscribe = onIntroDone(() => {
        gsap.to(fades, { autoAlpha: 1, y: 0, duration: 1.4, ease: "expo.out", stagger: 0.12, delay: 0.5 });
      });

      // Scroll: letterbox bars close in and the frame slowly pushes in.
      gsap.to(".hero-bar", {
        height: "14vh",
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(".hero-media", {
        scale: 1.12,
        yPercent: 8,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      return unsubscribe;
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative h-svh min-h-140 overflow-hidden bg-ink" aria-label="Showreel">
      <div className="hero-media absolute inset-0">
        <VideoPlayer
          title="REELCLICKS.IN showreel"
          src={background}
          poster={poster}
          background
          active={streamReady}
          priority
        />
      </div>
      <div aria-hidden="true" className="vignette absolute inset-0" />
      <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-ink via-ink/20 to-ink/40" />

      {/* Letterbox bars */}
      <div aria-hidden="true" className="hero-bar absolute inset-x-0 top-0 h-[7vh] bg-ink" />
      <div aria-hidden="true" className="hero-bar absolute inset-x-0 bottom-0 h-[7vh] bg-ink" />

      <div className="container-cinema relative flex h-full flex-col justify-end pb-[16vh] md:pb-[14vh]">
        <SectionLabel className="hero-fade">{label}</SectionLabel>
        <RevealText
          as="h1"
          trigger="mount"
          delay={0.15}
          stagger={0.16}
          className="mt-6 font-display text-[52px] leading-[0.92] font-light tracking-[-0.01em] text-ivory sm:text-[72px] md:text-[110px] xl:text-[168px]"
        >
          Turning Moments
          <br />
          <em className="text-gold-soft">Into Memories.</em>
        </RevealText>

        <div className="hero-fade mt-10 flex flex-wrap items-center gap-4">
          <Button onClick={() => setOpen(true)} data-track="showreel_play">
            <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor" aria-hidden="true">
              <path d="M0 0l10 6-10 6z" />
            </svg>
            Watch Showreel
          </Button>
          <Button href="/contact" variant="outline">
            Book Your Date
          </Button>
        </div>
      </div>

      {/* Scroll cue */}
      <div aria-hidden="true" className="hero-fade absolute right-5 bottom-[9vh] hidden flex-col items-center gap-4 md:right-10 md:flex">
        <span className="label text-[0.6rem] text-muted [writing-mode:vertical-rl]">Scroll</span>
        <span className="relative block h-20 w-px overflow-hidden bg-ivory/15">
          <span className="scroll-line absolute inset-x-0 top-0 h-1/2 bg-gold" />
        </span>
      </div>

      <Lightbox open={open} onClose={() => setOpen(false)} label="Showreel">
        <div className="relative aspect-video w-full max-w-6xl">
          <VideoPlayer title="REELCLICKS.IN showreel" src={full} poster={poster} controls autoPlay lazy={false} fit="contain" />
          {!full && (
            <p className="label pointer-events-none absolute inset-x-0 bottom-6 text-center text-muted">
              Showreel coming soon
            </p>
          )}
        </div>
      </Lightbox>
    </section>
  );
}
