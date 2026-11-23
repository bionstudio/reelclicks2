import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

/**
 * Sanity webhook → instantly refresh published content.
 * Sanity → API → Webhooks: URL https://reelclicks.in/api/revalidate,
 * trigger on create/update/delete, projection {_type, "slug": slug.current},
 * secret = SANITY_REVALIDATE_SECRET.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ message: "SANITY_REVALIDATE_SECRET is not set" }, { status: 500 });
  }

  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string; slug?: string }>(
      req,
      secret,
      true, // wait for Sanity's eventual consistency before revalidating
    );

    if (!isValidSignature) {
      return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
    }
    if (!body?._type) {
      return NextResponse.json({ message: "Missing _type" }, { status: 400 });
    }

    // References (e.g. a category name shown on portfolio cards) make per-type
    // invalidation fragile, so expire all Sanity content. The site is small.
    revalidateTag("sanity", { expire: 0 });

    return NextResponse.json({ revalidated: true, type: body._type, slug: body.slug ?? null });
  } catch (err) {
    return NextResponse.json({ message: (err as Error).message }, { status: 500 });
  }
}
