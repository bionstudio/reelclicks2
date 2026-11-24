"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type Hls from "hls.js";
import { isHls } from "@/lib/video";
import { prefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

type Props = {
  /** HLS (.m3u8) or MP4 URL. When empty, a cinematic placeholder is shown. */
  src?: string;
  poster?: string;
  /** Accessible description of the video. */
  title: string;
  /** Background mode: muted, looping, autoplay, no controls. */
  background?: boolean;
  /** Show native controls with sound (lightbox / full-screen player). */
  controls?: boolean;
  /** Start playing as soon as it's loaded (lightbox). */
  autoPlay?: boolean;
  /** Load the stream only when near the viewport. */
  lazy?: boolean;
  /** For hover previews: only load/play while `active` is true. */
  active?: boolean;
  /** How the video fills its box. Use contain in the lightbox. */
  fit?: "cover" | "contain";
  /** Prioritise the poster image (hero/LCP). */
  priority?: boolean;
  className?: string;
  /** Receives the <video> element (e.g. to control playback from outside). */
  onVideoElement?: (el: HTMLVideoElement | null) => void;
  onPlay?: () => void;
};

/** HLS-capable video with poster, lazy loading and a placeholder fallback. */
export function VideoPlayer({
  src,
  poster,
  title,
  background = false,
  controls = false,
  autoPlay = false,
  lazy = true,
  active,
  priority = false,
  fit = "cover",
  className,
  onVideoElement,
  onPlay,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const localRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(!lazy);
  const [playing, setPlaying] = useState(false);

  const wanted = active ?? inView;

  // Observe viewport proximity.
  useEffect(() => {
    if (!lazy || !wrapRef.current) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: "200px",
    });
    io.observe(wrapRef.current);
    return () => io.disconnect();
  }, [lazy]);

  // Attach the stream when wanted.
  useEffect(() => {
    const video = localRef.current;
    if (!video || !src || !wanted) return;
    if (background && prefersReducedMotion()) return;

    let hls: Hls | null = null;
    let cancelled = false;

    const start = () => {
      if (cancelled) return;
      if (background || autoPlay) video.play().catch(() => {});
    };

    if (!isHls(src) || video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      start();
    } else {
      import("hls.js").then(({ default: HlsCtor }) => {
        if (cancelled) return;
        if (!HlsCtor.isSupported()) return;
        hls = new HlsCtor({ capLevelToPlayerSize: true, startLevel: -1 });
        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(HlsCtor.Events.MANIFEST_PARSED, start);
      });
    }

    return () => {
      cancelled = true;
      video.pause();
      hls?.destroy();
      video.removeAttribute("src");
      video.load();
    };
  }, [src, wanted, background, autoPlay]);

  function setRefs(node: HTMLVideoElement | null) {
    localRef.current = node;
    onVideoElement?.(node);
  }

  return (
    <div ref={wrapRef} className={cn("relative h-full w-full overflow-hidden bg-surface", className)}>
      {/* Poster / placeholder underneath â€” fades out once video plays */}
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 transition-opacity duration-700",
          playing ? "opacity-0" : "opacity-100",
        )}
      >
        {poster ? (
          <Image
            src={poster}
            alt=""
            fill
            sizes="100vw"
            priority={priority}
            className="object-cover"
          />
        ) : (
          <div className="placeholder-media h-full w-full" />
        )}
      </div>

      {src && (
        <video
          ref={setRefs}
          className={cn("absolute inset-0 h-full w-full", fit === "contain" ? "object-contain" : "object-cover")}
          aria-label={title}
          playsInline
          muted={background}
          loop={background}
          controls={controls}
          preload="none"
          onPlaying={() => {
            setPlaying(true);
            onPlay?.();
          }}
          onPause={() => background && setPlaying(false)}
        />
      )}

      {!src && <span className="sr-only">{title} (video coming soon)</span>}
    </div>
  );
}
