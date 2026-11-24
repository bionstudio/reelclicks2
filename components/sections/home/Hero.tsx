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
  intro: string;
  handle: string;
  locations: string[];
  showreel?: VideoSource | null;
  showreelMobile?: VideoSource | null;
  poster?: string;
};

/** Full-screen showreel hero with letterbox bars, line-by-line headline and showreel player. */
export function Hero({ label, intro, handle, locations, showreel, showreelMobile, poster }: Props) {
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
        height: "12vh",
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
    <section ref={root} className="theme-dark relative h-svh min-h-160 overflow-hidden bg-black" aria-label="Showreel">
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
      <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-black via-black/45 to-black/55" />
      <div aria-hidden="true" className="absolute inset-0 bg-linear-to-r from-black/70 via-transparent to-transparent" />

      {/* Letterbox bars */}
      <div aria-hidden="true" className="hero-bar absolute inset-x-0 top-0 h-0 bg-black" />
      <div aria-hidden="true" className="hero-bar absolute inset-x-0 bottom-0 h-0 bg-black" />

      {/* Viewfinder: corner marks + REC + timecode */}
      <div aria-hidden="true" className="hero-fade pointer-events-none absolute inset-x-4 top-24 bottom-6 md:inset-x-8 md:top-28 md:bottom-8">
        <span className="absolute top-0 left-0 h-6 w-6 border-t-2 border-l-2 border-paper/50" />
        <span className="absolute top-0 right-0 h-6 w-6 border-t-2 border-r-2 border-paper/50" />
        <span className="absolute bottom-0 left-0 h-6 w-6 border-b-2 border-l-2 border-paper/50" />
        <span className="absolute right-0 bottom-0 h-6 w-6 border-r-2 border-b-2 border-paper/50" />
        <span className="label absolute top-4 left-5 flex items-center gap-2 text-paper md:left-6">
          <span className="h-2.5 w-2.5 animate-rec rounded-full bg-red" /> REC
        </span>
        <Timecode className="label absolute top-4 right-5 text-paper/70 tabular-nums md:right-6" />
        <span className="label absolute bottom-4 left-10 hidden text-paper/50 md:block">4K · 24FPS · 2.39:1</span>
      </div>

      <div className="container-cinema relative flex h-full flex-col justify-end pb-[14vh] md:pb-[12vh]">
        <SectionLabel className="hero-fade text-paper/80">{label}</SectionLabel>
        <RevealText
          as="h1"
          trigger="mount"
          delay={0.15}
          stagger={0.12}
          className="mt-5 font-display text-[15vw] leading-[0.86] text-paper sm:text-[76px] md:text-[min(10.5vw,15vh)] xl:text-[min(9.4vw,17vh)]"
        >
          Turning moments
          <br />
          into <em className="text-red">memories.</em>
        </RevealText>

        <div className="hero-fade mt-8 flex flex-col gap-8 md:mt-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-md">
            <p className="text-base leading-relaxed text-paper/80 md:text-lg">{intro}</p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
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
          <div className="hidden text-right md:block">
            <p className="label text-paper/60">Follow the work</p>
            <p className="mt-2 font-display text-2xl font-semibold text-paper">{handle}</p>
            <p className="label mt-3 text-paper/50">{locations.join(" · ")}</p>
          </div>
        </div>
      </div>

      <Lightbox open={open} onClose={() => setOpen(false)} label="Showreel">
        <div className="relative aspect-video w-full max-w-6xl">
          <VideoPlayer title="REELCLICKS.IN showreel" src={full} poster={poster} controls autoPlay lazy={false} fit="contain" />
          {!full && (
            <p className="label pointer-events-none absolute inset-x-0 bottom-6 text-center text-paper/60">
              Showreel coming soon
            </p>
          )}
        </div>
      </Lightbox>
    </section>
  );
}

/** Running camera timecode (HH:MM:SS:FF at 24fps) — decorative. */
function Timecode({ className }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const start = performance.now();
    let raf = 0;
    const pad = (n: number) => String(n).padStart(2, "0");
    const tick = (now: number) => {
      const t = (now - start) / 1000;
      const f = Math.floor((t % 1) * 24);
      const sec = Math.floor(t);
      if (ref.current) {
        ref.current.textContent = `${pad(Math.floor(sec / 3600))}:${pad(Math.floor(sec / 60) % 60)}:${pad(sec % 60)}:${pad(f)}`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <span ref={ref} className={className}>
      00:00:00:00
    </span>
  );
}
