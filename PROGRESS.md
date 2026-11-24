# PROGRESS — REELCLICKS.IN

Build plan: see `CLAUDE.md`. One phase at a time; each ends with `npm run build` + `npm run lint` passing.

## Phases

- [x] **Phase 0** — Project setup (Next.js, packages, folders, tokens, global CSS, config, env)
- [x] **Phase 1** — Global layout & components (preloader, header, menu, WhatsApp, mobile bar, footer, cursor, Lenis, transitions, UI kit)
- [x] **Phase 2** — Sanity CMS (Studio at `/studio`, schemas, webhook, seed content). The seed runs once the write token is added.
- [x] **Phase 3** — Home page
- [x] **Phase 4** — About page
- [x] **Phase 5** — Services page
- [x] **Phase 6** — Portfolio page + case studies
- [x] **Phase 7** — Team page
- [x] **Phase 8** — Contact page + enquiry form. Delivery switches on once a valid Sanity token and/or Resend key is added.
- [x] **Phase 9** — SEO, local city pages & tracking
- [x] **Phase 10** — Performance, QA & deployment docs. Lighthouse Performance is 82–91 (A11y, Best Practices and SEO are 100); see notes.

## Redesign — Creator × Cinematic (2026-11-25)

Client feedback on the first build: "not modern, colour combination bad, doesn't feel like a creator's website". Also: the founder is an Instagram influencer who promotes businesses, so that's now a headline offer.

- [x] New 3-colour system: Black `#0B0B0B` · Cream `#F4EFE6` · REC Red `#FF3D2E` (chosen by the user). `ink`/`paper` tokens swap inside `.theme-light` / `.theme-red` sections, so dark, cream and red sections alternate.
- [x] New type: Bricolage Grotesque (bold display), Instrument Serif italic accent words, Manrope body, Geist Mono labels with red ● REC dots
- [x] Hero redesigned as a camera viewfinder (corner marks, blinking REC, running timecode) + creator intro line + @handle
- [x] New sections: red services **ticker**, **For Brands & Businesses** (collab reels, promotion shoots, monthly content, "Promote My Business" WhatsApp CTA)
- [x] Header pill nav, pill buttons, rounded cards, red play badges, red final CTA, giant footer wordmark, black curtain with red edge, new OG image + email colours
- [x] Demo stock photos (Pexels licence, ~5 MB) in `public/media/demo`; used for any service/portfolio item without a Sanity thumbnail, the hero poster, About hero and BTS strip. **Replace with the client's own work before launch.**
- [x] Fixed: with reduced motion, the desktop services row is now scrollable (cards 5–8 were unreachable)
- [x] `CLAUDE.md` design system updated to match
- [ ] Client: real follower count / collab examples for the For Brands section (copy in `lib/config.ts → homeContent.brands`)

## Phase 0 checklist

- [x] Next.js 16.4 (App Router, TypeScript, Tailwind v4, ESLint, Turbopack)
- [x] Installed: gsap, lenis, motion, next-sanity, @sanity/image-url, react-hook-form, zod, resend, hls.js
- [x] Folders: `app/`, `components/{ui,sections,layout}`, `lib/{sanity}`, `sanity/schemas`, `public/media`
- [x] Design tokens in `app/globals.css` (`@theme`): ink, charcoal, gold, gold-soft, ivory, muted, fonts, easing
- [x] Global CSS: film grain, selection color, scrollbar, focus ring, vignette, placeholder media, reduced motion
- [x] Fonts via `next/font`: Cormorant Garamond (display), Manrope (body)
- [x] `lib/config.ts` contact/services/categories fallback; `lib/utils.ts` (cn, WhatsApp/tel links, safe sessionStorage)
- [x] `next.config.ts` image formats (AVIF/WebP) + remote hosts (Sanity, Mux, Bunny)
- [x] `.env.example` documenting every variable
- [x] `npm run build` + `npm run lint` pass

## Phase 1 checklist

- [x] Preloader (`components/layout/Preloader.tsx`) — aperture ring + blades → logo → letterbox bars open; ~1.9s; once per session (inline head script sets `data-preloaded`, sessionStorage wrapped in try/catch); reduced-motion = quick fade
- [x] Header — transparent → blurred black on scroll; logo / centre nav with gold active underline / "Book Your Date"
- [x] Full-screen mobile menu — clip-path reveal, staggered serif links, call numbers + WhatsApp, Esc to close, scroll lock
- [x] Floating WhatsApp button (gold ring + pulse, prefilled message)
- [x] Mobile sticky bar — WhatsApp + Call (safe-area aware)
- [x] Footer — big serif tagline, quick links, services (→ `/services#slug`), contacts, Instagram, service areas, ©
- [x] Custom cursor — gold circle; grows on links; "PLAY" / "VIEW" via `data-cursor="play|view"`; desktop only, off for reduced motion
- [x] Lenis smooth scroll synced to GSAP ScrollTrigger (`components/layout/SmoothScroll.tsx`, store in `lib/lenis.ts`)
- [x] Page transitions — black curtain wipe with gold hairline (`TransitionProvider` + `TransitionLink`), respects `#anchors`
- [x] UI kit: `Button` (magnetic), `SectionLabel`, `RevealText` (SplitText masked lines), `RevealMedia` (clip-path + parallax), `VideoPlayer` (HLS via hls.js / native, poster, lazy, placeholder), `Lightbox` (focus trap, Esc/arrows, letterbox), `Icons`, `Logo`
- [x] Placeholder pages for About / Services / Portfolio / Team / Contact so navigation works
- [x] `/styleguide` component showcase (noindex) — **remove before launch (Phase 10)**
- [x] Skip-to-content link, visible focus states, tap targets ≥ 44px
- [x] `npm run build` + `npm run lint` pass; all routes return 200

## Phase 2 checklist

- [x] Embedded Studio at `/studio` (`app/studio/[[...tool]]`, `sanity.config.ts`). Login uses a Sanity account; the page is noindex.
- [x] Site routes moved into the `app/(site)` group so the Studio renders full-screen without site chrome
- [x] Schemas (`sanity/schemas/`): `siteSettings`, `page` (SEO + About story), `service` (packages toggle), `category`, `portfolioItem`, `teamMember`, `testimonial`, `stat`, `faq`, `enquiry` (New / Contacted / Booked / Closed), `cityPage`, and objects `seo`, `videoSource` (Bunny / Mux / URL), `contactPerson`, `altImage`
- [x] Non-technical labels, help text and field groups; singletons (Site Settings, Pages) can't be duplicated or deleted
- [x] Drag-and-drop ordering (`@sanity/orderable-document-list`) for portfolio, categories, services, team, testimonials, numbers, FAQs
- [x] Studio sidebar (`sanity/structure.ts`): Enquiries grouped by status first, then content, Pages, Site Settings
- [x] Typed GROQ queries (`lib/sanity/queries.ts`) and front-end types (`lib/sanity/types.ts`)
- [x] Cached fetchers (`lib/sanity/fetch.ts`): `'use cache'` + `cacheTag("sanity")`, falling back to demo content when Sanity is empty or unreachable
- [x] On-demand revalidation webhook `POST /api/revalidate` (signature-checked, expires the cache immediately)
- [x] Demo content (`lib/sanity/demo.ts`): 8 services, 10 portfolio items, 5 categories, 2 leaders, 3 testimonials, 4 stats, 6 FAQs, 6 page SEO entries, About story
- [x] Seed script `npm run seed` (safe to re-run; `-- --force` resets to demo content)
- [x] Footer reads contacts, email, Instagram and areas from Site Settings
- [x] `npm run build` + `npm run lint` pass; `/studio`, pages and webhook guard smoke-tested
- [ ] **Run `npm run seed`** after adding `SANITY_API_WRITE_TOKEN`
- [ ] **Add the CORS origin** `http://localhost:3000` (and later `https://reelclicks.in`) in Sanity → API → CORS, with credentials allowed
- [ ] **Create the webhook** in Sanity after deploying (Phase 10). Steps are in `app/api/revalidate/route.ts`.

## Phase 3 checklist

- [x] **Hero:** full-screen background showreel (HLS, muted loop, 9:16 cut on mobile, poster first). Letterbox bars close in on scroll, plus vignette and grain. Headline reveals line by line, timed to the preloader ending. "Watch Showreel" opens a full-screen player with sound; "Book Your Date" goes to /contact. Animated gold scroll line.
- [x] **Manifesto:** words fill from muted to ivory on scroll. Text is editable in Sanity → Pages → Home.
- [x] **Numbers:** 4 counters from Sanity animate when scrolled into view.
- [x] **Services:** pinned horizontal scroll on desktop (≥1024px) with a gold progress line, vertical stack on mobile. Cards show 01–08, a hover preview video and a link to `/services#slug`.
- [x] **Featured work:** asymmetric editorial grid of the featured items, with hover preview, "PLAY" cursor and lightbox, plus "View Full Portfolio".
- [x] **Process:** Consult → Plan → Shoot → Edit → Deliver, with a gold timeline that draws on scroll (horizontal on desktop, vertical on mobile).
- [x] **Testimonials:** slow 8s auto-slide that pauses on hover/focus and is off for reduced motion. Prev/next buttons and a progress line.
- [x] **Instagram:** "Follow the story @reel_clicks.in" 9:16 marquee (pauses on hover). Uses the Behold feed when `NEXT_PUBLIC_BEHOLD_FEED_ID` is set, placeholders otherwise.
- [x] **Service areas:** stylised Maharashtra map with pulsing gold points on Nandgaon, Manmad, Nashik and Malegaon, city chips and "All over Maharashtra".
- [x] **Final CTA:** "Your story deserves a film." with WhatsApp "Check Date Availability" (prefilled) and "Send Enquiry". The headline is editable in the CMS.
- [x] **SEO:** title from CMS with fallback, canonical, Open Graph/Twitter tags, LocalBusiness JSON-LD, VideoObject JSON-LD (emitted once a showreel is uploaded), branded `/og` share image.
- [x] Reusable `PortfolioCard` and `PortfolioLightbox` (details, prev/next, share, "Book similar shoot"), ready for Phase 6.
- [x] `npm run build` + `npm run lint` pass; all sections render in the HTML.

## Phase 4 checklist

- [x] **Hero:** split layout, huge serif "We Are Storytellers." revealed line by line, slow-zoom behind-the-scenes image with clip reveal, label "ABOUT REELCLICKS.IN"
- [x] **Story:** editorial two-column text with a gold drop-cap. Editable in Sanity → Pages → About → Our story, with a fallback.
- [x] **Vision & Mission:** cards with gold hairline borders and corner accents. Editable in the CMS.
- [x] **Values:** Emotion First, Cinematic Craft, On-Time Delivery, Client Trust, each with a custom line icon. Editable in the CMS.
- [x] **Leadership:** Huzef Shaikh (Founder) and Adil Shaikh (CEO). Portraits go from grayscale to colour on hover; each card has a quote, bio, Call and WhatsApp. The reusable `LeaderCard` will be used again on the Team page.
- [x] **Behind-the-scenes strip:** click-and-drag on desktop (new "DRAG" cursor), native swipe with snapping on mobile, keyboard-scrollable. Photos from Sanity → Pages → About → Behind-the-scenes photos.
- [x] **CTA:** "Let's create your film."
- [x] **SEO:** title "About REELCLICKS.IN | Cinematic Video Studio in Nashik, Maharashtra", canonical, Organization + Person JSON-LD (linked by `@id`)
- [x] `npm run build` + `npm run lint` pass; all sections and schema present in the prerendered HTML

## Phase 5 checklist

- [x] Hero: "Films crafted for every story."
- [x] 8 full service sections with anchors (`#wedding-shoots`, `#wedding-cinematic-reels`, `#brand-promotional-shoots`, `#corporate-business-shoots`, `#business-meeting-shoots`, `#event-shoots-coverage`, `#travel-lifestyle-reels`, `#social-media-content`), alternating left/right on wide screens
- [x] Each section has a number, large serif title, emotional hook, description, "What's included", "Ideal for" and 2–3 portfolio films from the matching category (with lightbox). Reel-type services show vertical reels first.
- [x] Optional packages (Silver / Gold / Signature) with "Starting from ₹…" or "Get Quote". Toggle per service in Sanity → Services → Packages.
- [x] CTAs: "Enquire on WhatsApp" (prefilled "Hi REELCLICKS, I'm interested in [Service Name].") and "Send Enquiry" → `/contact?service=<slug>`
- [x] Sticky side index on desktop with an animated gold marker on the active service; sticky swipeable chip bar on mobile that follows the active service
- [x] FAQ accordion (accessible, one open at a time) + FAQPage JSON-LD; services ItemList/Service JSON-LD
- [x] `npm run build` + `npm run lint` pass

## Phase 6 checklist

- [x] Hero: "Our Work" + "Films that feel like memories."
- [x] Filter bar: All, Weddings, Brand & Promotional, Corporate, Events, Travel & Lifestyle, with counts. The gold underline slides between filters (Motion `layoutId`). The bar sticks under the header and swipes on mobile.
- [x] URL updates to `?category=` without reloading (shareable). Unknown categories fall back to "All".
- [x] Masonry/editorial grid (CSS columns) mixing 16:9 films and 9:16 reels, with smooth layout animation on filter change (Motion `layout` + `AnimatePresence popLayout`). Respects reduced motion.
- [x] Desktop hover plays a muted preview; tap on mobile opens the player
- [x] Lightbox: full-screen black, letterbox, HLS with sound, title/category/location/date/client/story, prev/next (within the current filter), share (native share sheet or copy link), "Book similar shoot" WhatsApp, "Full story →"
- [x] Case studies `/portfolio/[slug]`: breadcrumb, meta, final film, brief (portable text), behind-the-scenes gallery, testimonial, CTA, "Next film". All prerendered at build time.
- [x] Performance: 9 items then "Load more films" (+9), video loaded only on hover/click, `next/image` lazy loading, blurred LQIP placeholders from Sanity
- [x] VideoObject JSON-LD per item (case study) and an ItemList on /portfolio, emitted only for items with real videos. BreadcrumbList on case studies.
- [x] `npm run build` + `npm run lint` pass; gallery, `?category=`, case study and 404 smoke-tested

## Phase 7 checklist

- [x] Hero: "The People Behind The Lens."
- [x] Leadership spotlight: Huzef Shaikh (Founder), Adil Shaikh (CEO), in alternating editorial spreads. Each has a parallax portrait with clip reveal, gold role label, name, italic quote, bio, and Call / WhatsApp / Instagram buttons.
- [x] Crew grid from Sanity (team members not marked as leaders), grayscale → colour on hover. Until crew are added, shows crew roles (Cinematographers, Editors & Colourists, Drone Operators, Photographers) instead of invented names.
- [x] Gear strip: slow italic marquee, editable in Sanity → Pages → Team → Our gear (generic kit categories until real gear is listed). Hidden if the list is emptied.
- [x] CTA: "Let's make something timeless." with "Work with us" → /contact
- [x] SEO: title, canonical, Person JSON-LD for both leaders
- [x] `npm run build` + `npm run lint` pass

## Phase 8 checklist

- [x] Hero: "Let's Create Something Timeless." + pulsing "We reply within 2 hours"
- [x] Large tappable cards: WhatsApp Huzef, WhatsApp Adil, Call Huzef (`tel:+919112626278`), Call Adil (`tel:+919922801923`), Email, Instagram
- [x] Enquiry form with floating labels and a gold focus line: Name*, Phone/WhatsApp*, Email, Service* (8), Event date, City/Location, Budget range, Message
- [x] `?service=<slug>` pre-selects the service (links from the Services page)
- [x] zod schema shared by client and server (`lib/enquiry.ts`), react-hook-form + `@hookform/resolvers`; accessible errors (`aria-invalid`, `aria-describedby`, `role="alert"`)
- [x] Spam: honeypot (silent fake success), Cloudflare Turnstile (auto-enabled when keys are set), per-IP rate limit (5 per 10 min → 429)
- [x] `POST /api/enquiry`: saves the `enquiry` in Sanity (status New), emails the studio (branded HTML, "Reply on WhatsApp" button, reply-to = client), sends a thank-you email to the client. User input is HTML-escaped in emails.
- [x] Honest failure: if the lead can't be saved or emailed, the user sees an error with a WhatsApp link instead of a false "sent"
- [x] Success state: animated gold checkmark, "Thank you, {name}.", "Continue on WhatsApp" prefilled with the form details; `form_submit` analytics event
- [x] Service areas: "Available all over Maharashtra", city chips, dark-styled Google Map embed (lazy-loaded)
- [x] Business hours (from Site Settings) + "We reply within 2 hours"
- [x] LocalBusiness JSON-LD (phone, areaServed, sameAs Instagram)
- [x] `npm run build` + `npm run lint` pass; API tested: validation, bad service, bad email, honeypot, no-delivery 503, rate limit

## Phase 9 checklist

- [x] Sanity token validated; `npm run seed` loaded 49 documents (incl. 4 city pages). The site now reads live CMS content.
- [x] Per-page meta title/description from CMS (with fallbacks), OG/Twitter images (CMS image or `/og`), canonical URLs (all pages)
- [x] `/sitemap.xml`: static pages, 4 city pages, all portfolio case studies (20 URLs; updates when content is published)
- [x] `/robots.txt`: allows all and blocks `/studio`, `/api/`, `/styleguide`; points to the sitemap
- [x] JSON-LD: LocalBusiness (home, contact), Organization + Person (about, team), VideoObject (showreel and films, once videos exist), FAQPage (services), Service (services, city pages), BreadcrumbList (all inner pages and case studies)
- [x] City landing pages from `cityPage`: `/wedding-cinematographer-nashik`, `-malegaon`, `-manmad`, `-nandgaon`. Each has unique copy with drop-cap, city films (topped up with featured work), services list, links to the other cities, a WhatsApp CTA mentioning the city, and its own Service + Breadcrumb schema. New cities can be added in Sanity → City Pages.
- [x] Footer links to all city pages (internal linking)
- [x] Analytics (`components/analytics/Analytics.tsx`): GA4, Meta Pixel and Microsoft Clarity, each loading only when its env ID is set (IDs format-checked)
- [x] Events: `whatsapp_click` (any wa.me link), `call_click` (any tel: link), `showreel_play`, `form_submit` (→ Meta "Lead"); Meta PageView on client-side navigation
- [x] Enquiry form verified end to end: a test enquiry saved to Sanity, then deleted
- [x] `npm run build` + `npm run lint` pass

## Phase 10 checklist

- [x] **Hero:** the poster paints first. The background video streams only after the intro, when the browser is idle.
- [x] **LCP:** hero headlines paint at first paint under the preloader (first visit). Measured LCP is 0.52s at 4× CPU, and 1.8–2.0s in Lighthouse with applied throttling.
- [x] Fonts preloaded by `next/font`
- [x] **Less work during load:**
  - scroll reveals, word-splitting and parallax are set up only when near the viewport
  - below-fold sections use `content-visibility: auto`
  - the testimonial progress bar animates on the GPU
- [x] **Code-split:** custom cursor + analytics load after hydration; the mobile menu and lightbox (with the Motion library) load on first use
- [x] **Lite mode:** on low-end devices (≤2 GB RAM / ≤2 cores) or with Data Saver, the site drops smooth scroll, film grain, background video and reveal animations
- [x] **Responsive QA** at 360 / 390 / 768 / 1280 / 1920 on 8 page types: 0 overflow, 0 console errors, tap targets ≥ 44px (footer links widened)
- [x] **Reduced motion:** headline visible, no Lenis, no preloader
- [x] **Keyboard:** skip link first, visible focus on every stop, Esc closes the menu and lightbox
- [x] **Interaction tests:** mobile menu, curtain transition, portfolio filter + URL, lightbox, showreel player, `?service=` pre-select, form validation
- [x] **Fixed:**
  - hero label + CTAs not fading in (GSAP selector scope)
  - form focus line drawn under the error text
  - SplitText `aria-label` on `<p>`
  - manifesto contrast
  - card accessible names
  - portfolio heading order
- [x] **Lighthouse mobile** (applied throttling, typical of repeated runs):
  - Home 82–83 · About 90 · Team 90 · Portfolio 91 · Services 87–88 · Contact 87–89 · City/Case study ~88
  - A11y 100 · Best Practices 100 · SEO 100 on every page
  - CLS ≤ 0.004
- [x] `/styleguide` removed
- [x] `README.md`: setup, env vars, structure, Vercel deploy, Sanity CORS + webhook, domain + Resend DNS, quality notes, launch checklist
- [x] `CLIENT-GUIDE.md`: simple-language admin guide (login, enquiries, adding films via Bunny, images, showreel, common edits)
- [x] `npm run build` + `npm run lint` pass

## Decisions & notes

- **Performance target not fully met locally.** Home (82–83) and Services/Contact (87–89) are below 90 in Lighthouse Performance. The gap is main-thread time (TBT 200–450ms at 4× CPU) from GSAP/React hydration on these animation-rich pages. LCP and CLS targets are met everywhere. Lighthouse's *default simulated* throttling scores these pages lower (~60–70) because it attributes all early JavaScript to LCP; applied throttling and the real-browser trace show LCP at first paint. Re-measure on the live Vercel URL with PageSpeed Insights. If Home is still under 90, the next step is to simplify the first-visit preloader animation or trim GSAP usage on the Home page.
- **Local Lighthouse runs are noisy** on this machine (other Chrome processes). Back-to-back runs varied by up to 25 points; the figures above are from quiet, repeated runs.

- **City pages are a top-level dynamic route** (`app/(site)/[city]`). Fixed pages (/about, /contact …) always take priority; unknown slugs 404.
- **City copy was written fresh for each town** (Nashik vineyards and Godavari, Malegaon's big family weddings, Manmad's crossroads, Nandgaon as the studio's hometown). Review it before launch and add local venue names you actually work at.
- **No cookie banner.** GA4, Pixel and Clarity load without a consent prompt, which is common for India-only sites. Add a consent banner if you target EU visitors or if your legal advice requires one under the DPDP Act.

- **Rate limit is in-memory, per server instance.** It's a light first line of defence; Turnstile and the honeypot do the main work. If spam ever gets through, switch to Upstash Redis.
- **Resend test sender:** until `reelclicks.in` is verified in Resend, `onboarding@resend.dev` only delivers to the Resend account owner's email. Verify the domain before launch so client thank-you emails arrive.
- **Sanity token pasted on 2026-11-22 was rejected** (401 "Session not found"). It looked like a browser session token. A project API token with Editor rights is needed.

- **Gear is listed by category** ("Cinema cameras", "4K drones" …), not brand names, until the client confirms their actual kit.

- **Unknown case-study slugs:** with Next 16 Cache Components, the very first visit to a never-seen slug streams the 404 page with status 200 plus `noindex`; later visits return a real 404. This is framework behaviour (the docs recommend `notFound()`, which is used). Search engines won't index these pages.
- **Demo case studies** are only served while Sanity has no portfolio items, so deleted demo pages can't linger after launch.

- **Demo packages** are switched on for weddings only, to show the design. All prices are empty ("Get Quote") until real prices are supplied. The last package is badged "Most loved".
- **The contact form will read `?service=`** and pre-select the service (Phase 8).

- **Placeholder portraits** show the leaders' initials on a dark gradient until real photos are uploaded to Sanity → Team.

- **Hero video plays muted in the background only.** Sound is reserved for the "Watch Showreel" player. With reduced motion, only the poster shows.
- **VideoObject JSON-LD is skipped until a real showreel exists.** Google rejects VideoObject without a video URL.
- **The Maharashtra map is a simplified, decorative outline**, not survey-accurate. The four home towns sit close together in the north-west, so their labels are offset to stay readable.
- **The `/og` share image fetches Cormorant and Manrope from Google Fonts once at build time.** If that fails, it falls back to a default font.

- **Sanity v6 + `@sanity/icons` v5:** icons must be imported from their own paths (`@sanity/icons/Wrench`), not from the package root.
- **Vision (GROQ playground)** is only shown in the Studio during development, to keep the editors' Studio simple.
- **Webhook clears all content tags**, not only the edited type, because references (e.g. category names on portfolio cards) make per-type clearing unreliable. The site is small, so this is cheap.
- **Seeding never overwrites edits** (`createIfNotExists`). Use `--force` only to reset.
- **Demo testimonials and counter numbers are placeholders.** They are labelled "Demo …" and must be replaced with real ones before launch.
- `SANITY_REVALIDATE_SECRET` has been generated in `.env.local`. The same value goes into the Sanity webhook settings and into Vercel's environment variables.

- **Floating WhatsApp button shows on tablet/desktop only.** On mobile the sticky WhatsApp + Call bar replaces it, so the two never overlap.
- **Logo** is a text wordmark (`components/ui/Logo.tsx`) until the SVG arrives. It will then come from Sanity `siteSettings`.
- **Mobile bar "Call"** dials the Founder's number. Both numbers are in the menu and footer.
- **`npm create sanity` not run.** The Studio is embedded in the Next app at `/studio` (Phase 2) instead of being a separate project.
- **Native cursor stays visible** alongside the gold circle, for usability and accessibility.
- `/styleguide` uses a public Mux test stream only to verify HLS playback. It is not client content.

- **Tailwind v4:** design tokens live in CSS `@theme` (`app/globals.css`), not in `tailwind.config.js`. Classes work the same: `bg-ink`, `text-gold`, `font-display`, plus custom utilities `label`, `hairline`, `container-cinema`, `vignette`, `placeholder-media`.
- **`cacheComponents` is enabled** (Next 16 default from the scaffold). Data fetching in later phases uses the `'use cache'` approach.
- **Video host:** Bunny Stream is recommended (cheaper for India-based traffic); Mux is kept as an alternative in `.env.example`.
- **npm audit:** 17 warnings come from build-time dependencies of Sanity's tooling (js-yaml, minimatch, smol-toml), not from code shipped to the browser. Not force-fixed, because `npm audit fix --force` downgrades packages and breaks them. Re-check after future updates.
- `AGENTS.md` is generated by Next.js and points agents to the bundled docs. Keep it.

## Before launch: replace demo content

- [ ] Real counter numbers (Sanity → Numbers)
- [ ] Real testimonials (Sanity → Testimonials)
- [ ] Showreel + mobile cut + cover image (Sanity → Site Settings → Showreel)
- [ ] Portfolio videos and cover images; mark 5–6 as "Show on Home page"

## Content the client must provide

- [ ] Logo (SVG preferred)
- [ ] Showreel video (60–90s) + 9:16 mobile cut
- [ ] Portfolio videos per category, with titles/locations
- [ ] Founder & CEO photos + short bios
- [ ] Testimonials (text or video)
- [ ] Real numbers for counters
- [ ] Package details / starting prices (optional)

## Accounts / keys

| Service | Needed by | Status |
|---|---|---|
| Sanity (project ID, dataset, write token) | Phase 2 | ✅ connected and seeded (49 docs) |
| Resend (API key + verified domain) | Phase 8 | ☐ |
| Cloudflare Turnstile (site + secret key) | Phase 8 | ☐ |
| Bunny Stream or Mux | When real videos arrive | ☐ |
| Behold.so (Instagram feed) | Phase 3 (placeholder until then) | ☐ |
| GA4, Meta Pixel, Microsoft Clarity | Phase 9 | ☐ |
| Vercel + `reelclicks.in` domain | Phase 10 | ☐ |
