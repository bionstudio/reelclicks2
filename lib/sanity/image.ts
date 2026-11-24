import { createImageUrlBuilder } from "@sanity/image-url";
import { dataset, projectId } from "@/sanity/env";
import type { SanityImage } from "./types";

const builder = createImageUrlBuilder({ projectId: projectId || "missing", dataset });

/**
 * Sanity CDN image URL (auto WebP/AVIF). Falls back to a local demo image
 * (`src`) and returns undefined when no image is set.
 */
export function urlForImage(image?: SanityImage | null, width = 1600) {
  if (!image?.asset?._ref) return image?.src ?? undefined;
  return builder.image(image).width(width).auto("format").quality(80).url();
}
