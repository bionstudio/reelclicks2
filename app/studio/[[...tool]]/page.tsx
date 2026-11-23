import { connection } from "next/server";
import { NextStudio } from "next-sanity/studio";
import config from "../../../sanity.config";

export { metadata, viewport } from "next-sanity/studio";

// This route can't be prerendered (it needs runtime Sanity env vars), so
// render it on request instead of generating a build-time static shell.
export const instant = false;

/** Embedded Sanity Studio — log in with your Sanity account. */
export default async function StudioPage() {
  // Opt out of the build-time static shell: Sanity's client throws if
  // NEXT_PUBLIC_SANITY_PROJECT_ID isn't set, which would otherwise fail
  // the build before env vars are even read at runtime.
  await connection();
  return <NextStudio config={config} />;
}
