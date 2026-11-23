import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";
import { getCityPages, getPortfolioSlugs } from "@/lib/sanity/fetch";

/** /sitemap.xml — static pages, city landing pages and portfolio case studies. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [slugs, cities] = await Promise.all([getPortfolioSlugs(), getCityPages()]);
  const url = (path: string) => new URL(path, siteConfig.url).toString();

  const pages: Array<{ path: string; priority: number; freq: "weekly" | "monthly" }> = [
    { path: "/", priority: 1, freq: "weekly" },
    { path: "/portfolio", priority: 0.9, freq: "weekly" },
    { path: "/services", priority: 0.9, freq: "monthly" },
    { path: "/contact", priority: 0.8, freq: "monthly" },
    { path: "/about", priority: 0.7, freq: "monthly" },
    { path: "/team", priority: 0.6, freq: "monthly" },
  ];

  return [
    ...pages.map((p) => ({ url: url(p.path), changeFrequency: p.freq, priority: p.priority })),
    ...cities.map((c) => ({ url: url(`/${c.slug}`), changeFrequency: "monthly" as const, priority: 0.8 })),
    ...slugs.map((s) => ({ url: url(`/portfolio/${s}`), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
