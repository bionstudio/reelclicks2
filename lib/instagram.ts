import { cacheLife, cacheTag } from "next/cache";

export type InstagramPost = {
  id: string;
  permalink: string;
  image: string;
  caption?: string;
};

type BeholdSize = { mediaUrl?: string };
type BeholdPost = {
  id: string;
  permalink: string;
  mediaType?: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  caption?: string;
  prunedCaption?: string;
  sizes?: { small?: BeholdSize; medium?: BeholdSize; large?: BeholdSize };
};

/**
 * Latest Instagram posts via a Behold.so JSON feed (NEXT_PUBLIC_BEHOLD_FEED_ID).
 * Returns [] when not configured or unavailable — the section shows placeholders.
 */
export async function getInstagramPosts(limit = 12): Promise<InstagramPost[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("instagram");

  const feedId = process.env.NEXT_PUBLIC_BEHOLD_FEED_ID;
  if (!feedId) return [];
  try {
    const res = await fetch(`https://feeds.behold.so/${feedId}`);
    if (!res.ok) return [];
    const json = (await res.json()) as { posts?: BeholdPost[] } | BeholdPost[];
    const posts = Array.isArray(json) ? json : (json.posts ?? []);
    return posts
      .map((p) => ({
        id: p.id,
        permalink: p.permalink,
        image: p.sizes?.medium?.mediaUrl ?? p.thumbnailUrl ?? p.mediaUrl ?? "",
        caption: p.prunedCaption ?? p.caption,
      }))
      .filter((p) => p.image)
      .slice(0, limit);
  } catch {
    return [];
  }
}
