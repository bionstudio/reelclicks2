/**
 * Video source helpers. A video (from Sanity `videoSource`) is hosted on
 * Bunny Stream, Mux, or a direct HLS (.m3u8) / MP4 link.
 */

export type VideoSource = {
  provider?: "bunny" | "mux" | "url" | null;
  /** Bunny video ID or Mux playback ID. */
  id?: string | null;
  url?: string | null;
};

const bunnyHost = process.env.NEXT_PUBLIC_BUNNY_STREAM_CDN_HOSTNAME;

export function videoSrc(source?: VideoSource | null): string | undefined {
  if (!source) return undefined;
  switch (source.provider) {
    case "bunny":
      return bunnyHost && source.id ? `https://${bunnyHost}/${source.id}/playlist.m3u8` : undefined;
    case "mux":
      return source.id ? `https://stream.mux.com/${source.id}.m3u8` : undefined;
    case "url":
      return source.url ?? undefined;
    default:
      return undefined;
  }
}

export function videoPoster(source?: VideoSource | null): string | undefined {
  if (!source?.id) return undefined;
  if (source.provider === "bunny" && bunnyHost) return `https://${bunnyHost}/${source.id}/thumbnail.jpg`;
  if (source.provider === "mux") return `https://image.mux.com/${source.id}/thumbnail.webp`;
  return undefined;
}

export const isHls = (src: string) => /\.m3u8(\?|$)/i.test(src);
