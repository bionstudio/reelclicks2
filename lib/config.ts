/**
 * Fallback site configuration.
 * The live values come from Sanity `siteSettings` (Phase 2). These are used
 * when the CMS is not configured yet or a field is empty.
 */

export const siteConfig = {
  name: "REELCLICKS.IN",
  shortName: "REELCLICKS",
  tagline: "Turning Moments Into Memories.",
  description:
    "North Maharashtra's premium cinematic storytelling studio — wedding films, cinematic reels and brand shoots across Maharashtra.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://reelclicks.in",

  // Single config value — switch to hello@reelclicks.in when the domain mailbox is live.
  email: "huzefshaikh940@gmail.com",

  people: {
    founder: {
      name: "Huzef Shaikh",
      role: "Founder",
      phone: "+91 91126 26278",
      tel: "+919112626278",
      whatsapp: "919112626278",
    },
    ceo: {
      name: "Adil Shaikh",
      role: "CEO",
      phone: "+91 99228 01923",
      tel: "+919922801923",
      whatsapp: "919922801923",
    },
  },

  socials: {
    instagram: {
      handle: "@reel_clicks.in",
      url: "https://instagram.com/reel_clicks.in",
    },
  },

  serviceArea: "All over Maharashtra",
  locations: ["Nandgaon", "Manmad", "Nashik", "Malegaon"],

  whatsappMessages: {
    general: "Hi REELCLICKS, I'd like to enquire about a shoot.",
    availability: "Hi, I want to check availability for my date: ",
    promote: "Hi REELCLICKS, I want to promote my business with a reel / collab.",
    service: (serviceName: string) =>
      `Hi REELCLICKS, I'm interested in ${serviceName}.`,
  },
} as const;

/** Home page copy fallbacks (editable in Sanity → Pages → Home where noted). */
export const homeContent = {
  heroLabel: "Creator & Film Studio — Maharashtra",
  heroIntro:
    "Wedding films, brand reels and Instagram promotions — shot, edited and posted by the creator team behind @reel_clicks.in.",
  ticker: ["Wedding Films", "Brand Reels", "Instagram Collabs", "Business Promotions", "Event Coverage", "Travel Reels", "Corporate Films"],
  brands: {
    label: "For Brands & Businesses",
    title: "Your business,",
    titleEm: "on everyone's feed.",
    text:
      "We're not just behind the camera — we're creators with an engaged Instagram audience across Maharashtra. We plan, shoot and post reels that put cafés, stores, launches and local brands in front of the people who matter.",
    offers: [
      { title: "Collab Reels", text: "Your brand featured on @reel_clicks.in — scripted, shot, edited and posted by us." },
      { title: "Promotion Shoots", text: "Ad films and launch reels for cafés, showrooms, salons, gyms and real estate." },
      { title: "Monthly Content", text: "A ready-to-post reels calendar so your page never goes quiet." },
    ],
  },
  manifesto:
    "We don't just record events. We craft films that make you feel everything again — every glance, every laugh, every heartbeat.",
  finalCtaTitle: "Your story deserves a film.",
  process: [
    { title: "Consult", text: "We listen to your story, your people and the feeling you want to keep." },
    { title: "Plan", text: "Moodboards, shot lists, timelines and locations — every detail mapped." },
    { title: "Shoot", text: "A calm, cinematic crew that captures moments without interrupting them." },
    { title: "Edit", text: "Colour, music and rhythm — crafted frame by frame into a film." },
    { title: "Deliver", text: "Your film, reels and photos delivered on time, ready to relive forever." },
  ],
};

/** About page copy fallbacks (editable in Sanity → Pages → About). */
export const aboutContent = {
  intro:
    "A cinematic storytelling studio from North Maharashtra — crafting wedding films, reels and brand stories that feel like memories.",
  story: [
    "REELCLICKS.IN was born in North Maharashtra — in the lanes of Nandgaon and Manmad, at family weddings in Malegaon and on the vineyard roads of Nashik.",
    "It started with one camera and a simple belief: the most beautiful moments are the real ones. A father's quiet smile. A bride's nervous laugh. The hug that lasts a little longer than planned.",
    "Today we are a premium cinematic studio working all over Maharashtra — but we still tell every story the way we told the first one: honestly, patiently and with our whole heart.",
  ],
  vision:
    "To become Maharashtra's most loved cinematic storytelling studio, where every frame feels timeless.",
  mission:
    "To turn real moments into premium films and reels through creative direction, cinematic craft and honest service.",
  values: [
    { title: "Emotion First", text: "We chase feelings, not just footage. Every frame has to mean something." },
    { title: "Cinematic Craft", text: "Light, composition, colour and sound — handled with a filmmaker's care." },
    { title: "On-Time Delivery", text: "Clear timelines, honest updates and films delivered when we promise." },
    { title: "Client Trust", text: "Transparent pricing, calm communication and a team you can rely on." },
  ],
};

/** Team page fallbacks (editable in Sanity → Pages → Team / Team). */
export const teamContent = {
  intro:
    "Filmmakers, editors and storytellers from North Maharashtra — a small, dedicated crew that treats every story like our own.",
  crewRoles: [
    { role: "Cinematographers", text: "Light, movement and composition — the eye behind every frame." },
    { role: "Editors & Colourists", text: "Rhythm, music and colour that turn footage into feeling." },
    { role: "Drone Operators", text: "Licensed aerial cinematography for sweeping, safe shots." },
    { role: "Photographers", text: "Candid, editorial stills that sit beside every film." },
  ],
  gear: ["Cinema cameras", "Prime & zoom lenses", "4K drones", "Gimbals & stabilisers", "LED lighting kits", "Wireless audio", "Colour-graded edit suite"],
};

/** sessionStorage key — preloader plays once per session. */
export const PRELOADER_KEY = "rc-preloaded";

export const navigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Team", href: "/team" },
  { label: "Contact", href: "/contact" },
] as const;

export const services = [
  { slug: "wedding-shoots", title: "Professional Wedding Shoots" },
  { slug: "wedding-cinematic-reels", title: "Wedding Cinematic Reels" },
  { slug: "brand-promotional-shoots", title: "Brand & Promotional Shoots" },
  { slug: "corporate-business-shoots", title: "Corporate & Business Shoots" },
  { slug: "business-meeting-shoots", title: "Business Meeting Shoots" },
  { slug: "event-shoots-coverage", title: "Event Shoots & Coverage" },
  { slug: "travel-lifestyle-reels", title: "Travel & Lifestyle Reels" },
  { slug: "social-media-content", title: "Creative Social Media Content" },
] as const;

export const portfolioCategories = [
  { slug: "weddings", title: "Weddings" },
  { slug: "brand-promotional", title: "Brand & Promotional" },
  { slug: "corporate", title: "Corporate" },
  { slug: "events", title: "Events" },
  { slug: "travel-lifestyle", title: "Travel & Lifestyle" },
] as const;

export type ServiceSlug = (typeof services)[number]["slug"];
export type CategorySlug = (typeof portfolioCategories)[number]["slug"];
