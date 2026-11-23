import { createClient } from "next-sanity";
import { apiVersion, dataset, isSanityConfigured, projectId } from "@/sanity/env";

/** Read client. Next.js caching ('use cache' + cacheTag) sits on top, so the API CDN is off. */
export const client = createClient({
  projectId: projectId || "missing",
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "published",
});

/** Server-only write client (enquiries, seeding). Never import into client components. */
export function getWriteClient() {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!isSanityConfigured || !token) return null;
  return client.withConfig({ token, useCdn: false });
}
