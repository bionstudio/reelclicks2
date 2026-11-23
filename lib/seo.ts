import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";
import { urlForImage } from "@/lib/sanity/image";
import type { SanityImage, Seo, SiteSettings } from "@/lib/sanity/types";
import { videoPoster, videoSrc, type VideoSource } from "@/lib/video";

type MetaInput = {
  seo?: Seo | null;
  title: string;
  description: string;
  path: string;
  /** Use the title as-is (no "| REELCLICKS.IN" suffix). */
  absoluteTitle?: boolean;
};

/** Page metadata from CMS SEO fields with sensible fallbacks. */
export function buildMetadata({ seo, title, description, path, absoluteTitle }: MetaInput): Metadata {
  const metaTitle = seo?.metaTitle || title;
  const metaDescription = seo?.metaDescription || description;
  const og = urlForImage(seo?.ogImage, 1200);
  const images = og ? [{ url: og, width: 1200, height: 630 }] : [{ url: "/og", width: 1200, height: 630 }];

  return {
    title: absoluteTitle || seo?.metaTitle ? { absolute: metaTitle } : metaTitle,
    description: metaDescription,
    alternates: { canonical: path },
    robots: seo?.noIndex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: siteConfig.name,
      url: path,
      title: metaTitle,
      description: metaDescription,
      images,
    },
    twitter: { card: "summary_large_image", title: metaTitle, description: metaDescription, images },
  };
}

const abs = (p: string) => new URL(p, siteConfig.url).toString();

export function localBusinessJsonLd(s: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ProfessionalService"],
    "@id": abs("/#business"),
    name: siteConfig.name,
    alternateName: "REELCLICKS",
    slogan: s.tagline,
    description: siteConfig.description,
    url: siteConfig.url,
    image: abs("/og"),
    logo: urlForImage(s.logo, 512) ?? abs("/og"),
    telephone: s.founder.phone.replace(/\s/g, ""),
    email: s.email,
    priceRange: "₹₹₹",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Nashik",
      addressRegion: "Maharashtra",
      addressCountry: "IN",
    },
    areaServed: [
      { "@type": "State", name: "Maharashtra" },
      ...s.locations.map((name) => ({ "@type": "City", name })),
    ],
    sameAs: [s.instagramUrl],
    founder: { "@type": "Person", name: s.founder.name, jobTitle: s.founder.role },
    contactPoint: [s.founder, s.ceo].map((p) => ({
      "@type": "ContactPoint",
      telephone: p.phone.replace(/\s/g, ""),
      contactType: "customer service",
      name: `${p.name} (${p.role})`,
      areaServed: "IN-MH",
      availableLanguage: ["English", "Hindi", "Marathi"],
    })),
  };
}

export function organizationJsonLd(s: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": abs("/#organization"),
    name: siteConfig.name,
    url: siteConfig.url,
    logo: urlForImage(s.logo, 512) ?? abs("/og"),
    slogan: s.tagline,
    email: s.email,
    sameAs: [s.instagramUrl],
    founder: { "@id": abs("/about#person-founder") },
    employee: [{ "@id": abs("/about#person-founder") }, { "@id": abs("/about#person-ceo") }],
    areaServed: { "@type": "State", name: "Maharashtra" },
  };
}

export function personJsonLd(
  people: Array<{ name: string; role: string; phone?: string | null; instagram?: string | null; image?: string }>,
) {
  return people.map((p, i) => ({
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": abs(`/about#person-${i === 0 ? "founder" : i === 1 ? "ceo" : i}`),
    name: p.name,
    jobTitle: p.role,
    worksFor: { "@id": abs("/#organization") },
    ...(p.phone ? { telephone: p.phone.replace(/\s/g, "") } : {}),
    ...(p.image ? { image: p.image } : {}),
    ...(p.instagram ? { sameAs: [p.instagram] } : {}),
  }));
}

export function faqJsonLd(faqs: Array<{ question: string; answer: string }>) {
  if (!faqs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function servicesJsonLd(services: Array<{ title: string; slug: string; description?: string | null }>) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: services.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name: s.title,
        url: abs(`/services#${s.slug}`),
        ...(s.description ? { description: s.description } : {}),
        provider: { "@id": abs("/#business") },
        areaServed: { "@type": "State", name: "Maharashtra" },
      },
    })),
  };
}

type VideoItem = {
  title: string;
  slug: string;
  story?: string | null;
  date?: string | null;
  video?: VideoSource | null;
  thumbnail?: SanityImage | null;
};

/** VideoObject for a portfolio film — null until the item has a real video. */
export function portfolioVideoJsonLd(item: VideoItem, withContext = true) {
  const content = videoSrc(item.video);
  if (!content) return null;
  const thumb = urlForImage(item.thumbnail, 1280) ?? videoPoster(item.video) ?? abs("/og");
  return {
    ...(withContext ? { "@context": "https://schema.org" } : {}),
    "@type": "VideoObject",
    name: item.title,
    description: item.story || `${item.title} — a film by REELCLICKS.IN`,
    thumbnailUrl: [thumb],
    contentUrl: content,
    uploadDate: item.date || "2026-01-01",
    url: abs(`/portfolio/${item.slug}`),
    publisher: { "@id": abs("/#business") },
  };
}

/** ItemList of portfolio films that have videos. */
export function portfolioListJsonLd(items: VideoItem[]) {
  const videos = items.map((i) => portfolioVideoJsonLd(i, false)).filter(Boolean);
  if (!videos.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: videos.map((v, i) => ({ "@type": "ListItem", position: i + 1, item: v })),
  };
}

export function breadcrumbJsonLd(trail: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.name, item: abs(t.path) })),
  };
}

/** Wedding videography service in one city, provided by the studio (city landing pages). */
export function cityServiceJsonLd(city: string, slug: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Wedding Cinematography in ${city}`,
    serviceType: "Wedding videography and cinematic films",
    description,
    url: abs(`/${slug}`),
    provider: { "@id": abs("/#business") },
    areaServed: { "@type": "City", name: city, containedInPlace: { "@type": "State", name: "Maharashtra" } },
  };
}

/** VideoObject for the showreel — only emitted once a real video is uploaded. */
export function showreelJsonLd(s: SiteSettings) {
  const content = videoSrc(s.showreel);
  if (!content) return null;
  const thumb = urlForImage(s.showreelPoster, 1280) ?? videoPoster(s.showreel) ?? abs("/og");
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: `${siteConfig.name} Showreel`,
    description: "Cinematic wedding films, reels and brand stories by REELCLICKS.IN across Maharashtra.",
    thumbnailUrl: [thumb],
    contentUrl: content,
    uploadDate: "2026-01-01",
    publisher: { "@id": abs("/#business") },
  };
}
