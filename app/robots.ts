import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";

/** /robots.txt — keep the admin panel and API out of search. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/studio", "/api/"] }],
    sitemap: new URL("/sitemap.xml", siteConfig.url).toString(),
    host: siteConfig.url,
  };
}
