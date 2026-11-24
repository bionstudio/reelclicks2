import Image from "next/image";
import { urlForImage } from "@/lib/sanity/image";
import type { SanityImage } from "@/lib/sanity/types";
import { cn } from "@/lib/utils";

/** Neutral gradient placeholders, varied so a grid never looks repetitive. */
const VARIANTS = [
  "radial-gradient(90% 70% at 80% 90%, rgb(255 61 46 / .22), transparent 60%), linear-gradient(160deg, #222221, #0e0e0e 60%, #050505)",
  "radial-gradient(80% 80% at 20% 20%, rgb(244 239 230 / .10), transparent 55%), linear-gradient(200deg, #1b1b1a, #0b0b0b 55%, #050505)",
  "radial-gradient(100% 70% at 50% 100%, rgb(255 61 46 / .16), transparent 60%), linear-gradient(180deg, #0c0c0c, #1a1918)",
  "linear-gradient(140deg, #2a2927, #0b0b0b)",
  "radial-gradient(110% 60% at 70% 40%, rgb(244 239 230 / .08), transparent 60%), linear-gradient(170deg, #1d1d1c, #080808)",
];

type Props = {
  image?: SanityImage | null;
  alt: string;
  /** Picks a placeholder variant when there's no image. */
  variant?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

/** Sanity image (CDN, WebP/AVIF) or a cinematic placeholder until real media is uploaded. */
export function CoverMedia({ image, alt, variant = 0, sizes = "100vw", priority, className }: Props) {
  const src = urlForImage(image, 2000);
  if (src) {
    return (
      <Image
        src={src}
        alt={image?.alt || alt}
        fill
        sizes={sizes}
        priority={priority}
        {...(image?.lqip ? { placeholder: "blur" as const, blurDataURL: image.lqip } : {})}
        className={cn("object-cover", className)}
      />
    );
  }
  return (
    <div
      role="img"
      aria-label={alt}
      className={cn("absolute inset-0", className)}
      style={{ background: VARIANTS[Math.abs(variant) % VARIANTS.length] }}
    />
  );
}
