/**
 * Front-end shapes returned by the GROQ queries in ./queries.ts.
 * Demo/fallback content (./demo.ts) uses the same types.
 */
import type { VideoSource } from "@/lib/video";

export type SanityImage = {
  asset?: { _ref: string } | null;
  hotspot?: { x: number; y: number; width: number; height: number } | null;
  crop?: { top: number; bottom: number; left: number; right: number } | null;
  alt?: string | null;
  /** Tiny blurred preview (base64) from Sanity, used while the image loads. */
  lqip?: string | null;
};

export type PortableTextBlock = {
  _type: "block";
  _key: string;
  children: Array<{ _type: "span"; _key: string; text: string; marks?: string[] }>;
  markDefs?: unknown[];
  style?: string;
};

export type Person = {
  name: string;
  role: string;
  phone: string;
  whatsapp: string;
};

export type SiteSettings = {
  tagline: string;
  email: string;
  founder: Person;
  ceo: Person;
  instagramHandle: string;
  instagramUrl: string;
  serviceArea: string;
  locations: string[];
  businessHours: string;
  logo?: SanityImage | null;
  showreel?: VideoSource | null;
  showreelMobile?: VideoSource | null;
  showreelPoster?: SanityImage | null;
};

export type Seo = {
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogImage?: SanityImage | null;
  noIndex?: boolean | null;
};

export type Category = { _id: string; title: string; slug: string };

export type ServicePackage = {
  name: string;
  price?: number | null;
  features: string[];
};

export type Service = {
  _id: string;
  title: string;
  slug: string;
  shortLine: string;
  hook: string;
  description: string;
  included: string[];
  idealFor: string[];
  categorySlug?: string | null;
  thumbnail?: SanityImage | null;
  previewVideo?: VideoSource | null;
  showPackages: boolean;
  packages: ServicePackage[];
};

export type PortfolioItem = {
  _id: string;
  title: string;
  slug: string;
  category: { title: string; slug: string };
  thumbnail?: SanityImage | null;
  video?: VideoSource | null;
  previewVideo?: VideoSource | null;
  aspectRatio: "16:9" | "9:16";
  featured: boolean;
  location?: string | null;
  date?: string | null;
  client?: string | null;
  story?: string | null;
};

export type PortfolioDetail = PortfolioItem & {
  brief?: PortableTextBlock[] | null;
  bts?: SanityImage[] | null;
  testimonial?: Testimonial | null;
  seo?: Seo | null;
};

export type CityPage = {
  _id: string;
  city: string;
  slug: string;
  headline?: string | null;
  intro?: string | null;
  body?: PortableTextBlock[] | null;
  portfolio?: PortfolioItem[] | null;
  seo?: Seo | null;
};

export type TeamMember = {
  _id: string;
  name: string;
  role: string;
  isLeader: boolean;
  photo?: SanityImage | null;
  bio?: string | null;
  quote?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  instagram?: string | null;
};

export type Testimonial = {
  _id: string;
  quote: string;
  name: string;
  eventType?: string | null;
  city?: string | null;
};

export type Stat = { _id: string; label: string; value: number; suffix?: string | null };

export type Faq = { _id: string; question: string; answer: string };

export type PageSettings = {
  title?: string | null;
  manifesto?: string | null;
  finalCtaTitle?: string | null;
  story?: PortableTextBlock[] | null;
  heroImage?: SanityImage | null;
  vision?: string | null;
  mission?: string | null;
  values?: Array<{ title: string; text: string }> | null;
  gallery?: SanityImage[] | null;
  gear?: string[] | null;
  seo?: Seo | null;
};
