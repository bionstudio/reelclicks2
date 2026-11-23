/**
 * Cached, typed content fetchers. Each falls back to demo content when Sanity
 * isn't configured, is empty, or is unreachable — so the site always renders.
 *
 * Freshness: results are cached ('use cache') and tagged. The Sanity webhook
 * (app/api/revalidate) expires the tags the moment content is published.
 */
import { cacheLife, cacheTag } from "next/cache";
import { isSanityConfigured } from "@/sanity/env";
import { client } from "./client";
import * as q from "./queries";
import * as demo from "./demo";
import type {
  Category,
  CityPage,
  PortableTextBlock,
  Faq,
  PageSettings,
  PortfolioDetail,
  PortfolioItem,
  Service,
  SiteSettings,
  Stat,
  TeamMember,
  Testimonial,
} from "./types";

export const SANITY_TAG = "sanity";

async function fetchOr<T>(
  query: string,
  fallback: T,
  params: Record<string, string> = {},
): Promise<T> {
  if (!isSanityConfigured) return fallback;
  try {
    const data = await client.fetch<T | null>(query, params);
    if (data == null || (Array.isArray(data) && data.length === 0)) return fallback;
    return data;
  } catch (err) {
    console.warn("[sanity] fetch failed, using demo content:", (err as Error).message);
    return fallback;
  }
}

function tag(...types: string[]) {
  cacheLife("hours");
  cacheTag(SANITY_TAG, ...types);
}

/** Merge CMS values over the fallback so empty fields never break the layout. */
function withFallback<T extends object>(data: Partial<T> | null, fallback: T): T {
  if (!data) return fallback;
  const out = { ...fallback } as Record<string, unknown>;
  for (const [k, v] of Object.entries(data)) {
    const empty = v == null || v === "" || (Array.isArray(v) && v.length === 0);
    if (!empty) out[k] = v;
  }
  return out as T;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  "use cache";
  tag("siteSettings");
  const data = await fetchOr<Partial<SiteSettings> | null>(q.siteSettingsQuery, null);
  const merged = withFallback(data, demo.demoSiteSettings);
  merged.founder = withFallback(data?.founder ?? null, demo.demoSiteSettings.founder);
  merged.ceo = withFallback(data?.ceo ?? null, demo.demoSiteSettings.ceo);
  return merged;
}

export async function getPage(key: string): Promise<PageSettings> {
  "use cache";
  tag("page");
  return fetchOr<PageSettings>(q.pageQuery, {}, { key });
}

export async function getCategories(): Promise<Category[]> {
  "use cache";
  tag("category");
  return fetchOr(q.categoriesQuery, demo.demoCategories);
}

export async function getServices(): Promise<Service[]> {
  "use cache";
  tag("service", "category");
  return fetchOr(q.servicesQuery, demo.demoServices);
}

export async function getPortfolio(): Promise<PortfolioItem[]> {
  "use cache";
  tag("portfolioItem", "category");
  return fetchOr(q.portfolioQuery, demo.demoPortfolio);
}

export async function getFeaturedPortfolio(): Promise<PortfolioItem[]> {
  "use cache";
  tag("portfolioItem", "category");
  return fetchOr(
    q.featuredPortfolioQuery,
    demo.demoPortfolio.filter((p) => p.featured).slice(0, 6),
  );
}

/** Demo case-study content is used only while Sanity has no portfolio items at all. */
async function cmsHasPortfolio() {
  return (await fetchOr<number>(`count(*[_type == "portfolioItem"])`, 0)) > 0;
}

export async function getPortfolioItem(slug: string): Promise<PortfolioDetail | null> {
  "use cache";
  tag("portfolioItem", "category", "testimonial");
  if (isSanityConfigured) {
    const data = await fetchOr<PortfolioDetail | null>(q.portfolioItemQuery, null, { slug });
    if (data) return data;
    if (await cmsHasPortfolio()) return null;
  }
  const item = demo.demoPortfolio.find((p) => p.slug === slug);
  if (!item) return null;
  return {
    ...item,
    brief: null,
    bts: null,
    testimonial: item.featured ? (demo.demoTestimonials[demo.demoPortfolio.indexOf(item) % demo.demoTestimonials.length] ?? null) : null,
  };
}

export async function getPortfolioSlugs(): Promise<string[]> {
  "use cache";
  tag("portfolioItem");
  return fetchOr(q.portfolioSlugsQuery, demo.demoPortfolio.map((p) => p.slug));
}

const paragraphsToBlocks = (paras: string[]): PortableTextBlock[] =>
  paras.map((text, i) => ({
    _type: "block",
    _key: `p${i}`,
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: `p${i}s`, text, marks: [] }],
  }));

function demoCity(slug: string, portfolio: PortfolioItem[]): CityPage | null {
  const c = demo.demoCityPages.find((x) => x.slug === slug);
  if (!c) return null;
  return {
    _id: `city-${c.slug}`,
    city: c.city,
    slug: c.slug,
    headline: c.headline,
    intro: c.intro,
    body: paragraphsToBlocks(c.body),
    portfolio: portfolio.filter((p) => p.location?.toLowerCase().includes(c.city.toLowerCase())),
    seo: { metaTitle: c.metaTitle, metaDescription: c.metaDescription },
  };
}

async function cmsHasCityPages() {
  return (await fetchOr<number>(`count(*[_type == "cityPage"])`, 0)) > 0;
}

export async function getCityPage(slug: string): Promise<CityPage | null> {
  "use cache";
  tag("cityPage", "portfolioItem", "category");
  if (isSanityConfigured) {
    const data = await fetchOr<CityPage | null>(q.cityPageQuery, null, { slug });
    if (data) return data;
    if (await cmsHasCityPages()) return null;
  }
  return demoCity(slug, await getPortfolio());
}

export async function getCityPages(): Promise<Array<Pick<CityPage, "_id" | "city" | "slug">>> {
  "use cache";
  tag("cityPage");
  return fetchOr(
    q.cityPagesQuery,
    demo.demoCityPages.map((c) => ({ _id: `city-${c.slug}`, city: c.city, slug: c.slug })),
  );
}

export async function getTeam(): Promise<TeamMember[]> {
  "use cache";
  tag("teamMember");
  return fetchOr(q.teamQuery, demo.demoTeam);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  "use cache";
  tag("testimonial");
  return fetchOr(q.testimonialsQuery, demo.demoTestimonials);
}

export async function getStats(): Promise<Stat[]> {
  "use cache";
  tag("stat");
  return fetchOr(q.statsQuery, demo.demoStats);
}

export async function getFaqs(): Promise<Faq[]> {
  "use cache";
  tag("faq");
  return fetchOr(q.faqsQuery, demo.demoFaqs);
}
