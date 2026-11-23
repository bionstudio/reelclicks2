/**
 * Seeds Sanity with demo content.
 *
 *   npm run seed           → creates documents that don't exist yet (safe to re-run)
 *   npm run seed -- --force → overwrites demo documents with fresh demo content
 *
 * Needs NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN in .env.local.
 */
import { createClient, type SanityDocumentStub } from "@sanity/client";
import { LexoRank } from "lexorank";
import {
  demoCategories,
  demoFaqs,
  demoPortfolio,
  demoServices,
  demoSiteSettings,
  demoStats,
  demoTeam,
  demoTestimonials,
  demoCityPages,
} from "../lib/sanity/demo";
import { aboutContent, homeContent, teamContent } from "../lib/config";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;
const force = process.argv.includes("--force");

if (!projectId || !token) {
  console.error("✖ Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN in .env.local first.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-11-01",
  useCdn: false,
});

/** Sequential LexoRank values so drag-and-drop ordering works from day one. */
function ranks(n: number) {
  const out: string[] = [];
  let r = LexoRank.min().genNext().genNext();
  for (let i = 0; i < n; i++) {
    out.push(r.toString());
    r = r.genNext().genNext();
  }
  return out;
}

const slug = (current: string) => ({ _type: "slug", current });
const ref = (_ref: string) => ({ _type: "reference", _ref });
const key = (i: number) => `k${i}`;
const block = (text: string, i: number) => ({
  _type: "block",
  _key: key(i),
  style: "normal",
  markDefs: [],
  children: [{ _type: "span", _key: `${key(i)}s`, text, marks: [] }],
});

function docs(): SanityDocumentStub[] {
  const out: SanityDocumentStub[] = [];

  // Site settings
  const s = demoSiteSettings;
  out.push({
    _id: "siteSettings",
    _type: "siteSettings",
    tagline: s.tagline,
    email: s.email,
    founder: { _type: "contactPerson", ...s.founder },
    ceo: { _type: "contactPerson", ...s.ceo },
    instagramHandle: s.instagramHandle,
    instagramUrl: s.instagramUrl,
    serviceArea: s.serviceArea,
    locations: s.locations,
    businessHours: s.businessHours,
  });

  // Pages (SEO + texts)
  const pages: Array<[string, string, string, string]> = [
    ["home", "Home", "REELCLICKS.IN | Cinematic Wedding & Brand Films in Maharashtra", "North Maharashtra's premium cinematic storytelling studio. Wedding films, cinematic reels and brand shoots across Nashik, Malegaon, Manmad, Nandgaon and all of Maharashtra."],
    ["about", "About", "About REELCLICKS.IN | Cinematic Video Studio in Nashik, Maharashtra", "Born in North Maharashtra, REELCLICKS.IN is a premium cinematic storytelling studio turning real moments into timeless films."],
    ["services", "Services", "Wedding, Brand & Event Video Services | REELCLICKS.IN", "Professional wedding shoots, cinematic reels, brand films, corporate and event coverage across Maharashtra."],
    ["portfolio", "Portfolio", "Portfolio | Wedding Films & Brand Videos | REELCLICKS.IN", "Watch our wedding films, cinematic reels, brand and corporate videos from across Maharashtra."],
    ["team", "Team", "Our Team | The People Behind The Lens | REELCLICKS.IN", "Meet Huzef Shaikh, Adil Shaikh and the REELCLICKS.IN crew of cinematographers and editors."],
    ["contact", "Contact", "Contact REELCLICKS.IN | Book Your Shoot in Maharashtra", "Check your date and book a wedding, brand or event shoot. WhatsApp, call or send an enquiry — we reply within 2 hours."],
  ];
  for (const [k, title, metaTitle, metaDescription] of pages) {
    out.push({
      _id: `page-${k}`,
      _type: "page",
      key: k,
      title,
      seo: { _type: "seo", metaTitle, metaDescription, noIndex: false },
      ...(k === "home"
        ? { manifesto: homeContent.manifesto, finalCtaTitle: homeContent.finalCtaTitle }
        : {}),
      ...(k === "team" ? { gear: teamContent.gear } : {}),
      ...(k === "about"
        ? {
            story: aboutContent.story.map(block),
            vision: aboutContent.vision,
            mission: aboutContent.mission,
            values: aboutContent.values.map((v, i) => ({ _type: "value", _key: key(i), ...v })),
          }
        : {}),
    });
  }

  // Categories
  ranks(demoCategories.length).forEach((orderRank, i) => {
    const c = demoCategories[i];
    out.push({ _id: c._id, _type: "category", title: c.title, slug: slug(c.slug), orderRank });
  });

  // Services
  ranks(demoServices.length).forEach((orderRank, i) => {
    const v = demoServices[i];
    out.push({
      _id: v._id,
      _type: "service",
      title: v.title,
      slug: slug(v.slug),
      shortLine: v.shortLine,
      hook: v.hook,
      description: v.description,
      included: v.included,
      idealFor: v.idealFor,
      ...(v.categorySlug ? { category: ref(`category-${v.categorySlug}`) } : {}),
      showPackages: v.showPackages,
      packages: v.packages.map((p, j) => ({ _type: "package", _key: key(j), name: p.name, features: p.features })),
      orderRank,
    });
  });

  // Testimonials (before portfolio so references resolve)
  ranks(demoTestimonials.length).forEach((orderRank, i) => {
    const t = demoTestimonials[i];
    out.push({ _id: t._id, _type: "testimonial", quote: t.quote, name: t.name, eventType: t.eventType, city: t.city, orderRank });
  });

  // Portfolio
  ranks(demoPortfolio.length).forEach((orderRank, i) => {
    const p = demoPortfolio[i];
    out.push({
      _id: p._id,
      _type: "portfolioItem",
      title: p.title,
      slug: slug(p.slug),
      category: ref(`category-${p.category.slug}`),
      aspectRatio: p.aspectRatio,
      featured: p.featured,
      location: p.location,
      date: p.date,
      client: p.client,
      story: p.story,
      ...(i === 0 ? { testimonial: ref(demoTestimonials[0]._id) } : {}),
      orderRank,
    });
  });

  // Team
  ranks(demoTeam.length).forEach((orderRank, i) => {
    const m = demoTeam[i];
    out.push({
      _id: m._id,
      _type: "teamMember",
      name: m.name,
      role: m.role,
      isLeader: m.isLeader,
      bio: m.bio,
      quote: m.quote,
      phone: m.phone,
      whatsapp: m.whatsapp,
      instagram: m.instagram,
      orderRank,
    });
  });

  // City landing pages (portfolio = films shot in that city)
  for (const c of demoCityPages) {
    const films = demoPortfolio.filter((p) => p.location?.toLowerCase().includes(c.city.toLowerCase()));
    out.push({
      _id: `city-${c.slug}`,
      _type: "cityPage",
      city: c.city,
      slug: slug(c.slug),
      headline: c.headline,
      intro: c.intro,
      body: c.body.map(block),
      portfolio: films.map((p, i) => ({ ...ref(p._id), _key: key(i) })),
      seo: { _type: "seo", metaTitle: c.metaTitle, metaDescription: c.metaDescription, noIndex: false },
    });
  }

  // Stats & FAQs
  ranks(demoStats.length).forEach((orderRank, i) => {
    const st = demoStats[i];
    out.push({ _id: st._id, _type: "stat", label: st.label, value: st.value, suffix: st.suffix, orderRank });
  });
  ranks(demoFaqs.length).forEach((orderRank, i) => {
    const f = demoFaqs[i];
    out.push({ _id: f._id, _type: "faq", question: f.question, answer: f.answer, orderRank });
  });

  return out;
}

async function main() {
  const all = docs();
  const tx = client.transaction();
  for (const d of all) {
    if (force) tx.createOrReplace(d as SanityDocumentStub & { _id: string });
    else tx.createIfNotExists(d as SanityDocumentStub & { _id: string });
  }
  await tx.commit({ visibility: "async" });

  const counts = all.reduce<Record<string, number>>((acc, d) => {
    acc[d._type] = (acc[d._type] ?? 0) + 1;
    return acc;
  }, {});
  console.log(`✔ Seeded ${all.length} documents into ${projectId}/${dataset}${force ? " (forced)" : ""}:`);
  for (const [t, n] of Object.entries(counts)) console.log(`   ${t.padEnd(14)} ${n}`);
}

main().catch((err) => {
  console.error("✖ Seed failed:", err.message);
  process.exit(1);
});
