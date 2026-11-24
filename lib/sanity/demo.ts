/**
 * Demo content — the site shows this until real content is published in
 * Sanity, and `npm run seed` uploads it as a starting point.
 * Testimonials and numbers are PLACEHOLDERS: replace with real ones before launch.
 */
import { portfolioCategories, siteConfig } from "../config";
import type {
  Category,
  Faq,
  PortfolioItem,
  Service,
  SiteSettings,
  Stat,
  TeamMember,
  SanityImage,
  Testimonial,
} from "./types";

const { founder, ceo } = siteConfig.people;

/**
 * Free stock photos (Pexels licence) in /public/media/demo — placeholders so the
 * site looks real before the client's own work is uploaded in Sanity.
 */
export const demoImage = (name: string, alt = ""): SanityImage => ({ src: `/media/demo/${name}.jpg`, alt });

export const demoBts: SanityImage[] = [
  demoImage("bts-crew", "Film crew setting up a shot"),
  demoImage("bts-monitor", "Camera monitor during a shoot"),
  demoImage("creator-ringlight", "Creator filming with a ring light"),
  demoImage("bts-studio", "Studio shoot with lighting"),
  demoImage("bts-operator", "Camera operator on set"),
  demoImage("brand-food", "Filming food content on a gimbal"),
  demoImage("hero-alt", "Cinema camera operator"),
  demoImage("creator-phone", "Phone recording a vertical reel"),
];

export const demoSiteSettings: SiteSettings = {
  tagline: siteConfig.tagline,
  email: siteConfig.email,
  founder: { name: founder.name, role: founder.role, phone: founder.phone, whatsapp: founder.whatsapp },
  ceo: { name: ceo.name, role: ceo.role, phone: ceo.phone, whatsapp: ceo.whatsapp },
  instagramHandle: siteConfig.socials.instagram.handle,
  instagramUrl: siteConfig.socials.instagram.url,
  serviceArea: siteConfig.serviceArea,
  locations: [...siteConfig.locations],
  businessHours: "Mon – Sun · 9:00 AM – 9:00 PM",
  logo: null,
  showreel: null,
  showreelMobile: null,
  showreelPoster: demoImage("hero", "Cinematographer filming with a cinema camera"),
};

export const demoCategories: Category[] = portfolioCategories.map((c) => ({
  _id: `category-${c.slug}`,
  title: c.title,
  slug: c.slug,
}));

const SERVICE_IMAGES: Record<string, string> = {
  "wedding-shoots": "wedding-couple-garden",
  "wedding-cinematic-reels": "wedding-couple",
  "brand-promotional-shoots": "brand-cafe",
  "corporate-business-shoots": "corporate-team",
  "business-meeting-shoots": "corporate-meeting",
  "event-shoots-coverage": "event-stage",
  "travel-lifestyle-reels": "travel-road",
  "social-media-content": "creator-ringlight",
};

const PORTFOLIO_IMAGES: Record<string, string> = {
  "vineyard-vows": "wedding-garlands",
  "haldi-in-gold": "wedding-haldi",
  "the-quiet-vidaai": "wedding-veil",
  "monsoon-sangeet": "wedding-portrait",
  "the-roastery": "brand-food",
  "threads-of-maharashtra": "brand-studio",
  "built-to-last": "corporate-office",
  "annual-dealers-meet": "event-crowd",
  "festival-of-lights": "event-red",
  "sahyadri-sunrise": "travel-ghats",
};

const svc = (
  slug: string,
  title: string,
  categorySlug: string,
  shortLine: string,
  hook: string,
  description: string,
  included: string[],
  idealFor: string[],
): Service => ({
  _id: `service-${slug}`,
  slug,
  title,
  categorySlug,
  shortLine,
  hook,
  description,
  included,
  idealFor,
  thumbnail: SERVICE_IMAGES[slug] ? demoImage(SERVICE_IMAGES[slug], title) : null,
  previewVideo: null,
  // Packages shown for weddings only, as a design example. Prices stay empty
  // ("Get Quote") until the client supplies real ones.
  showPackages: slug === "wedding-shoots",
  packages:
    slug === "wedding-shoots"
      ? [
          { name: "Silver", price: null, features: ["One-day coverage", "Highlight film (3–5 min)", "Edited photos"] },
          { name: "Gold", price: null, features: ["Two-day coverage", "Cinematic highlight + full film", "Drone coverage", "Instagram reels"] },
          { name: "Signature", price: null, features: ["Multi-day coverage", "Feature film + documentary edit", "Same-day teaser", "Premium album"] },
        ]
      : [
          { name: "Silver", price: null, features: [] },
          { name: "Gold", price: null, features: [] },
          { name: "Signature", price: null, features: [] },
        ],
});

export const demoServices: Service[] = [
  svc(
    "wedding-shoots",
    "Professional Wedding Shoots",
    "weddings",
    "Every ritual, every tear, every laugh — told like cinema.",
    "The day you'll want to relive forever.",
    "Complete wedding coverage with a cinematic eye. From haldi to vidaai, we document every ritual and every quiet glance, then craft it into a film your family will watch for generations.",
    ["Full-day photo & film coverage", "Cinematic highlight film", "Traditional full-length film", "Drone coverage (where permitted)", "Edited photo album"],
    ["Couples planning a premium wedding", "Destination & multi-day weddings", "Families who want timeless heirlooms"],
  ),
  svc(
    "wedding-cinematic-reels",
    "Wedding Cinematic Reels",
    "weddings",
    "Short, soulful reels made for Instagram and forever.",
    "Your love story, in sixty breathtaking seconds.",
    "Vertical, music-driven reels cut for social media — the moments that make everyone stop scrolling, delivered fast so you can share while the celebration is still fresh.",
    ["9:16 cinematic reels", "Licensed / trending music", "Colour grading", "Quick 48–72 hour delivery"],
    ["Couples who love sharing on Instagram", "Pre-wedding & engagement shoots", "Sangeet and reception highlights"],
  ),
  svc(
    "brand-promotional-shoots",
    "Brand & Promotional Shoots",
    "brand-promotional",
    "Films that make people feel your brand.",
    "Stories that sell without shouting.",
    "Concept-to-delivery brand films and promotional videos — scripted, styled and shot to give your business a premium, trustworthy presence online.",
    ["Concept & script", "Professional crew & lighting", "Product and lifestyle shots", "Edited ad film + social cut-downs"],
    ["Restaurants, cafés & retail brands", "Real estate & hospitality", "Product launches"],
  ),
  svc(
    "corporate-business-shoots",
    "Corporate & Business Shoots",
    "corporate",
    "Polished films that build trust.",
    "Show the people and the pride behind your business.",
    "Company profiles, founder stories, factory and office walkthroughs — clean, confident films that present your business at its best.",
    ["Company profile film", "Interviews & testimonials", "Workplace b-roll", "Branded titles & subtitles"],
    ["Manufacturers & industries", "Schools, hospitals & institutions", "Startups and growing companies"],
  ),
  svc(
    "business-meeting-shoots",
    "Business Meeting Shoots",
    "corporate",
    "Conferences and meetings, captured with clarity.",
    "Every voice heard, every key moment kept.",
    "Discreet, professional coverage of meetings, seminars and conferences — multi-camera recording, clean audio and quick highlight edits.",
    ["Multi-camera recording", "Professional audio", "Highlight video", "Full session recording"],
    ["Board & dealer meetings", "Seminars and conferences", "Award functions"],
  ),
  svc(
    "event-shoots-coverage",
    "Event Shoots & Coverage",
    "events",
    "Celebrations, captured in full colour.",
    "The energy of the night, kept alive.",
    "Birthdays, anniversaries, launches and cultural events — complete photo and video coverage with a cinematic highlight film.",
    ["Photo & video coverage", "Cinematic highlight film", "Same-day teaser (on request)", "Drone coverage (where permitted)"],
    ["Birthdays & anniversaries", "Cultural & religious events", "Product launches and openings"],
  ),
  svc(
    "travel-lifestyle-reels",
    "Travel & Lifestyle Reels",
    "travel-lifestyle",
    "Places and moments that feel like a dream.",
    "Wanderlust, framed beautifully.",
    "Travel films and lifestyle reels for creators, resorts and tourism brands — sweeping landscapes, golden-hour light and stories that make people want to be there.",
    ["Location scouting", "Drone & gimbal cinematography", "Vertical & horizontal edits", "Colour grading"],
    ["Resorts, hotels & homestays", "Creators and influencers", "Tourism campaigns"],
  ),
  svc(
    "social-media-content",
    "Creative Social Media Content",
    "brand-promotional",
    "Scroll-stopping content, made consistently.",
    "Content that keeps your audience coming back.",
    "Monthly reels and content packages — planned, shot and edited for Instagram, YouTube and Facebook so your brand stays fresh and premium every week.",
    ["Content planning", "Monthly reels package", "Hooks, captions & trends", "Fast turnaround"],
    ["Local businesses & brands", "Personal brands & professionals", "Restaurants, salons & gyms"],
  ),
];

const item = (
  slug: string,
  title: string,
  cat: string,
  aspectRatio: "16:9" | "9:16",
  featured: boolean,
  location: string,
  date: string,
  client: string,
  story: string,
): PortfolioItem => {
  const category = demoCategories.find((c) => c.slug === cat)!;
  return {
    _id: `portfolio-${slug}`,
    slug,
    title,
    category: { title: category.title, slug: category.slug },
    aspectRatio,
    featured,
    location,
    date,
    client,
    story,
    thumbnail: PORTFOLIO_IMAGES[slug] ? demoImage(PORTFOLIO_IMAGES[slug], title) : null,
    video: null,
    previewVideo: null,
  };
};

export const demoPortfolio: PortfolioItem[] = [
  item("vineyard-vows", "Vineyard Vows", "weddings", "16:9", true, "Nashik", "2026-02-14", "A & M", "A golden-hour wedding among the vineyards of Nashik — soft light, close family and a promise that felt timeless."),
  item("haldi-in-gold", "Haldi in Gold", "weddings", "9:16", true, "Malegaon", "2026-01-22", "S & R", "Laughter, marigolds and turmeric-stained hands — a haldi morning full of colour."),
  item("the-quiet-vidaai", "The Quiet Vidaai", "weddings", "16:9", false, "Manmad", "2025-12-08", "P & K", "A film about the one moment no one is ready for, and everyone remembers."),
  item("monsoon-sangeet", "Monsoon Sangeet", "weddings", "9:16", true, "Nandgaon", "2025-08-17", "N & V", "Rain outside, music inside — a sangeet that turned into a celebration of family."),
  item("the-roastery", "The Roastery — Brand Film", "brand-promotional", "16:9", true, "Nashik", "2026-03-05", "Local café brand", "A slow, sensory brand film about craft coffee and the people behind each cup."),
  item("threads-of-maharashtra", "Threads of Maharashtra", "brand-promotional", "9:16", false, "Malegaon", "2025-11-12", "Textile label", "Reels celebrating handloom weavers and the textures of their work."),
  item("built-to-last", "Built to Last — Company Profile", "corporate", "16:9", true, "Nashik MIDC", "2025-10-01", "Manufacturing company", "A company profile that puts its people, precision and pride front and centre."),
  item("annual-dealers-meet", "Annual Dealers Meet", "events", "16:9", false, "Nashik", "2025-09-20", "Regional distributor", "Multi-camera coverage of a dealer meet, cut into a crisp highlight film."),
  item("festival-of-lights", "Festival of Lights", "events", "9:16", false, "Manmad", "2025-10-20", "Community celebration", "Diyas, fireworks and faces lit with joy — a Diwali night in motion."),
  item("sahyadri-sunrise", "Sahyadri Sunrise", "travel-lifestyle", "16:9", false, "Sahyadri ranges", "2025-07-02", "Travel series", "Mist, monsoon greens and a sunrise above the Western Ghats."),
];

export const demoTeam: TeamMember[] = [
  {
    _id: "team-huzef-shaikh",
    name: founder.name,
    role: founder.role,
    isLeader: true,
    photo: null,
    bio: "Huzef started REELCLICKS with a single camera and a love for real emotion. Today he leads every story the studio tells — from the first conversation to the final frame.",
    quote: "We don't film events. We film feelings.",
    phone: founder.phone,
    whatsapp: founder.whatsapp,
    instagram: siteConfig.socials.instagram.url,
  },
  {
    _id: "team-adil-shaikh",
    name: ceo.name,
    role: ceo.role,
    isLeader: true,
    photo: null,
    bio: "Adil runs the studio's operations and client experience — making sure every couple and brand feels looked after, and every film is delivered on time.",
    quote: "A premium film begins with a premium experience.",
    phone: ceo.phone,
    whatsapp: ceo.whatsapp,
    instagram: siteConfig.socials.instagram.url,
  },
];

// PLACEHOLDER testimonials — replace with real client words before launch.
export const demoTestimonials: Testimonial[] = [
  {
    _id: "testimonial-demo-1",
    quote: "Watching our wedding film felt like living the day all over again. Every glance, every tear — they caught it all.",
    name: "Demo Couple",
    eventType: "Wedding",
    city: "Nashik",
  },
  {
    _id: "testimonial-demo-2",
    quote: "Calm, creative and completely professional. Our brand film made our café feel exactly the way we always imagined it.",
    name: "Demo Brand Owner",
    eventType: "Brand Film",
    city: "Malegaon",
  },
  {
    _id: "testimonial-demo-3",
    quote: "They were everywhere and nowhere at once. We never noticed the cameras, but nothing was missed.",
    name: "Demo Family",
    eventType: "Family Event",
    city: "Manmad",
  },
];

// PLACEHOLDER numbers — replace with real figures before launch.
export const demoStats: Stat[] = [
  { _id: "stat-weddings", label: "Weddings Filmed", value: 150, suffix: "+" },
  { _id: "stat-brands", label: "Brands Served", value: 40, suffix: "+" },
  { _id: "stat-reels", label: "Reels Delivered", value: 500, suffix: "+" },
  { _id: "stat-views", label: "Million+ Views", value: 10, suffix: "M+" },
];

export const demoFaqs: Faq[] = [
  {
    _id: "faq-delivery",
    question: "How long does delivery take?",
    answer: "Cinematic reels are usually delivered within 3–7 days. Full wedding films and albums take 3–6 weeks depending on the season. We'll confirm exact timelines when you book.",
  },
  {
    _id: "faq-travel",
    question: "Do you travel across Maharashtra?",
    answer: "Yes. We're based in Nandgaon, Manmad, Nashik and Malegaon, and we shoot all over Maharashtra. Travel and stay for outstation shoots are discussed upfront — no surprises.",
  },
  {
    _id: "faq-booking",
    question: "How do I book a date? Is an advance required?",
    answer: "Message us on WhatsApp or send an enquiry to check availability. A date is confirmed once the booking advance is received; the balance is due before final delivery.",
  },
  {
    _id: "faq-drone",
    question: "Do you provide drone coverage?",
    answer: "Yes, we offer drone cinematography wherever it's permitted and safe. For some venues and city areas, permission is required — we'll guide you.",
  },
  {
    _id: "faq-revisions",
    question: "Can I ask for changes to my film?",
    answer: "Of course. Every package includes a round of revisions on the highlight film so the final cut feels exactly right.",
  },
  {
    _id: "faq-raw",
    question: "Will I get the raw footage?",
    answer: "Raw footage can be provided on request in a hard drive or cloud link. Let us know when booking so we can include it in your package.",
  },
];

/** Local landing pages — unique copy per city (Google rewards original content). */
export const demoCityPages: Array<{
  slug: string;
  city: string;
  headline: string;
  intro: string;
  body: string[];
  metaTitle: string;
  metaDescription: string;
}> = [
  {
    slug: "wedding-cinematographer-nashik",
    city: "Nashik",
    headline: "Wedding Cinematographer in Nashik",
    intro:
      "Vineyard vows, Godavari ghats and grand banquet nights — cinematic wedding films for Nashik couples who want their day to feel like a movie.",
    body: [
      "Nashik weddings have a character of their own. Golden-hour light across the vineyards, temple ceremonies by the Godavari, and receptions that carry on long after midnight. We know these venues, their light and their timings — so we can plan every frame before the first ritual begins.",
      "Our Nashik wedding coverage blends documentary honesty with cinematic craft: candid moments during the haldi, sweeping drone shots of the venue where permitted, and a highlight film cut to music that feels like you.",
      "From intimate family weddings to multi-day celebrations, we bring a calm, experienced crew, quick reels for Instagram and a full-length film you'll watch for decades.",
    ],
    metaTitle: "Wedding Cinematographer in Nashik | REELCLICKS.IN",
    metaDescription:
      "Cinematic wedding films, reels and photography in Nashik — vineyard weddings, temple ceremonies and grand receptions. Check your date with REELCLICKS.IN.",
  },
  {
    slug: "wedding-cinematographer-malegaon",
    city: "Malegaon",
    headline: "Wedding Cinematographer in Malegaon",
    intro:
      "Big families, bigger celebrations. Cinematic wedding films for Malegaon that capture every relative, every ritual and every quiet glance in between.",
    body: [
      "Weddings in Malegaon are about togetherness — full halls, long guest lists and traditions passed down through generations. Our job is to make sure no one and nothing is missed, while still telling a story that feels intimate.",
      "We plan coverage around your family's customs and timelines, with multiple cameras for the busiest moments, careful audio for vows and speeches, and portraits of the people who matter most.",
      "Expect a cinematic highlight film, shareable reels within days, and a complete film that preserves the whole celebration — beautifully colour-graded and delivered on time.",
    ],
    metaTitle: "Wedding Cinematographer in Malegaon | REELCLICKS.IN",
    metaDescription:
      "Premium wedding videography and cinematic reels in Malegaon. Multi-camera coverage, drone shots and on-time delivery by REELCLICKS.IN.",
  },
  {
    slug: "wedding-cinematographer-manmad",
    city: "Manmad",
    headline: "Wedding Cinematographer in Manmad",
    intro:
      "From the railway town to the hills of Ankai — wedding films for Manmad couples, made by a team that calls this region home.",
    body: [
      "Manmad sits at the crossroads of North Maharashtra, and so do its weddings — families travelling in from every direction to celebrate together. We love telling those stories of arrival, reunion and joy.",
      "Because we're local, we know the venues, the drive times and the best light around Manmad. That means less stress on your day and more time spent capturing what matters.",
      "Choose a cinematic highlight film, Instagram-ready reels, full traditional coverage — or all three. Every package is planned with you, not sold to you.",
    ],
    metaTitle: "Wedding Cinematographer in Manmad | REELCLICKS.IN",
    metaDescription:
      "Local wedding cinematographer in Manmad. Cinematic highlight films, reels and full wedding coverage by REELCLICKS.IN — check your date on WhatsApp.",
  },
  {
    slug: "wedding-cinematographer-nandgaon",
    city: "Nandgaon",
    headline: "Wedding Cinematographer in Nandgaon",
    intro:
      "Where REELCLICKS began. Wedding films for Nandgaon families, made with the same care we'd give our own.",
    body: [
      "REELCLICKS.IN started here — at Nandgaon weddings, with one camera and a love for real emotion. Filming in our hometown still means something special to us.",
      "We know Nandgaon's families, venues and traditions, and we bring the same premium, cinematic approach we take across Maharashtra: thoughtful planning, an unobtrusive crew and films that feel timeless.",
      "Whether it's an intimate ceremony at home or a full celebration with the whole town invited, we'll capture it beautifully — and deliver it on time.",
    ],
    metaTitle: "Wedding Cinematographer in Nandgaon | REELCLICKS.IN",
    metaDescription:
      "Hometown wedding cinematographer in Nandgaon. Cinematic wedding films, reels and photography by REELCLICKS.IN, serving all of Maharashtra.",
  },
];
