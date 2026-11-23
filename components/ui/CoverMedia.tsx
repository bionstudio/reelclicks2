import Image from "next/image";
import { urlForImage } from "@/lib/sanity/image";
import type { SanityImage } from "@/lib/sanity/types";
import { cn } from "@/lib/utils";

/** Cinematic gradient placeholders, varied so a grid never looks repetitive. */
const VARIANTS = [
  "radial-gradient(120% 80% at 25% 15%, rgb(201 169 110 / .22), transparent 60%), linear-gradient(160deg, #1d1a16, #0b0a09 60%, #050505)",
  "radial-gradient(90% 90% at 80% 20%, rgb(230 211 163 / .14), transparent 55%), linear-gradient(200deg, #17171a, #0b0b0d 55%, #050505)",
  "radial-gradient(100% 70% at 50% 100%, rgb(201 169 110 / .2), transparent 60%), linear-gradient(180deg, #0c0c0c, #16130f)",
  "radial-gradient(80% 80% at 15% 85%, rgb(160 120 80 / .22), transparent 60%), linear-gradient(140deg, #141210, #070707)",
  "radial-gradient(110% 60% at 70% 40%, rgb(243 238 230 / .08), transparent 60%), linear-gradient(170deg, #1a1714, #080808)",
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
