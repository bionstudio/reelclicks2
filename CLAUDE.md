# CLAUDE.md — REELCLICKS.IN Website Build

> This file is the single source of truth for building the REELCLICKS.IN website.
> Read it fully before writing any code. Then build **one phase at a time**, in order (Phase 0 → Phase 10).

---

## HOW TO WORK (instructions for Claude)

1. Read this entire file first.
2. Work through the phases **in order**. Do not skip ahead.
3. At the start of each phase, briefly state what you will build.
4. At the end of each phase:
   - Run `npm run build` and `npm run lint` and fix all errors.
   - Tick the phase's checklist in `PROGRESS.md` (create it in Phase 0).
   - Give a short summary of what was built and what the client must supply (videos, photos, keys).
   - **Stop and wait for the user to say "next"** before starting the next phase.
5. Never hard-code content that belongs in the CMS. Use Sanity with sensible fallback/demo content so the site looks complete before real media arrives.
6. Use placeholder media (dark cinematic stock-style placeholders or solid gradients with film grain) until the client uploads real videos and photos. Never use photos of real public figures.
7. Keep secrets in `.env.local` and document every variable in `.env.example`. Never commit keys.
8. If something is ambiguous, pick the most premium, minimal, mobile-friendly option and note it in `PROGRESS.md`.

---

## 1. BRAND

| Item | Value |
|---|---|
| Name | REELCLICKS.IN |
| Tagline | Turning Moments Into Memories. |
| Positioning | North Maharashtra's premium cinematic storytelling studio |
| Theme | Luxury Cinematic |
| Personality | Cinematic, luxurious, calm confidence, emotional, minimal. Never cheap, never cluttered. |
| Audience | Premium wedding couples & families, brands, businesses, event organisers in Maharashtra |

### Contact data (store in Sanity `siteSettings` + a fallback config file)

- **Founder:** Huzef Shaikh — +91 91126 26278 — WhatsApp `https://wa.me/919112626278`
- **CEO:** Adil Shaikh — +91 99228 01923 — WhatsApp `https://wa.me/919922801923`
- **Email:** huzefshaikh940@gmail.com (single config value; will later switch to `hello@reelclicks.in`)
- **Instagram:** @reel_clicks.in — `https://instagram.com/reel_clicks.in`
- **Service area:** All over Maharashtra
- **Main locations:** Nandgaon, Manmad, Nashik, Malegaon

### Services (8)

1. Professional Wedding Shoots
2. Wedding Cinematic Reels
3. Brand & Promotional Shoots
4. Corporate & Business Shoots
5. Business Meeting Shoots
6. Event Shoots & Coverage
7. Travel & Lifestyle Reels
8. Creative Social Media Content

### Portfolio categories

Weddings · Brand & Promotional · Corporate · Events · Travel & Lifestyle

---

## 2. TECH STACK (mandatory)

| Layer | Tech |
|---|---|
| Framework | Next.js (latest, App Router) + TypeScript |
| Styling | Tailwind CSS |
| Animation | GSAP + ScrollTrigger, Lenis (smooth scroll), Motion (Framer Motion) |
| CMS / Admin | Sanity (embedded Studio at `/studio`) |
| Video | Bunny Stream or Mux (HLS adaptive streaming). Never self-host large MP4s. |
| Images | `next/image` + Sanity image CDN (WebP/AVIF) |
| Fonts | `next/font` — Cormorant Garamond (display), Manrope (body) |
| Forms | react-hook-form + zod, Resend for email, leads saved in Sanity |
| Spam protection | Honeypot + Cloudflare Turnstile |
| Instagram | Behold.so widget (or Instagram Graph API) |
| Analytics | GA4, Meta Pixel, Microsoft Clarity |
| Hosting | Vercel |

---

## 3. DESIGN SYSTEM

### Colors (Tailwind tokens)

| Token | Hex | Use |
|---|---|---|
| `ink` | `#0A0A0A` | Matte black base |
| `charcoal` | `#141414` | Surfaces / cards |
| `gold` | `#C9A96E` | Champagne gold accent (max ~10% of any screen) |
| `gold-soft` | `#E6D3A3` | Hover / highlight |
| `ivory` | `#F3EEE6` | Primary text |
| `muted` | `#8A857C` | Secondary text |

### Typography

- Display: **Cormorant Garamond**, light/italic for emotion, huge sizes (80–180px desktop, 44–64px mobile).
- Body: **Manrope**.
- Labels: uppercase, letter-spacing `0.3em`, small size, often gold.

### Visual language

- Letterbox (2.39:1) framing, subtle film-grain overlay, soft vignette.
- Thin 1px gold hairlines, generous negative space, 12-column grid, asymmetric editorial layouts.

### Motion

- Slow cinematic easing (`expo.out`, `power3.out`).
- Masked line-by-line text reveals, clip-path image/video reveals, parallax depth.
- Magnetic buttons. Custom cursor: gold circle that becomes **"PLAY"** over videos and **"VIEW"** over projects (desktop only).
- Every animation has a lighter mobile version. Respect `prefers-reduced-motion`.

### Mobile

- Mobile-first. Tap targets ≥ 44px.
- Sticky bottom bar on mobile: **WhatsApp** + **Call**.

---

## 4. QUALITY BAR

- Lighthouse mobile 90+ (Performance, Accessibility, SEO, Best Practices).
- LCP < 2.5s on 4G, CLS < 0.1.
- Semantic HTML, alt text, visible focus states, WCAG AA contrast.
- Clean folder structure, reusable components, typed Sanity queries.

---

## 5. BUILD PHASES

### PHASE 0 — Project setup

- Create Next.js (App Router, TypeScript, Tailwind, ESLint) project.
- Install: `gsap`, `lenis`, `motion`, `next-sanity`, `@sanity/image-url`, `react-hook-form`, `zod`, `resend`, `hls.js`.
- Folder structure:
  ```
  app/ (routes)        components/ (ui, sections, layout)
  lib/ (sanity, utils, config)    sanity/ (schemas)    public/
  ```
- Tailwind config with design tokens above; global CSS (film grain, selection color, scrollbar).
- `lib/config.ts` with contact data fallback.
- Create `PROGRESS.md` with a checklist of all phases.
- Create `.env.example`.

### PHASE 1 — Global layout & components

- **Preloader:** camera-shutter/aperture animation revealing the logo, then letterbox bars open to the page. Max 2s; skipped on repeat visits (sessionStorage, wrapped in try/catch).
- **Header:** transparent over hero → blurred black on scroll. Logo left, nav centre (Home, About, Services, Portfolio, Team, Contact), gold **"Book Your Date"** button right. Full-screen cinematic menu on mobile.
- **Floating WhatsApp button:** gold ring with pulse → `https://wa.me/919112626278?text=Hi%20REELCLICKS%2C%20I'd%20like%20to%20enquire%20about%20a%20shoot.`
- **Mobile sticky bar:** WhatsApp + Call.
- **Footer:** big serif tagline, quick links, services, contacts, Instagram, service areas, © REELCLICKS.IN.
- **Custom cursor**, **Lenis smooth scroll** provider, **page transitions** (black curtain wipe with gold hairline).
- Reusable: `Button` (magnetic), `SectionLabel`, `RevealText`, `RevealMedia`, `VideoPlayer` (HLS + poster + lazy), `Lightbox`.

### PHASE 2 — Sanity CMS (admin panel)

- Embedded Studio at `/studio` with login.
- Schemas: `siteSettings` (logo, tagline, contacts, socials, showreel), `service`, `portfolioItem`, `category`, `teamMember`, `testimonial`, `stat`, `faq`, `enquiry` (status: New / Contacted / Booked / Closed), `cityPage`, `page SEO` fields.
- `portfolioItem`: title, slug, category, thumbnail, video (Bunny/Mux ID or URL), aspect ratio (16:9 / 9:16), location, date, client, story, featured flag, order.
- Non-technical labels, drag-and-drop ordering, works on mobile.
- On-demand revalidation webhook so published changes appear instantly.
- Seed demo content for all 8 services, 10 portfolio items, 2 leaders, 3 testimonials, 4 stats, 6 FAQs.

### PHASE 3 — HOME page

1. **Hero:** full-screen background showreel (muted, autoplay, loop, HLS, poster fallback; lighter cut on mobile). Letterbox bars, grain, vignette. Label: "CINEMATIC STORYTELLING STUDIO — MAHARASHTRA". Headline revealed line by line: *"Turning Moments / Into Memories."* CTAs: "Watch Showreel" (full-screen player with sound) and "Book Your Date". Animated gold scroll line.
2. **Manifesto:** large serif paragraph whose words fill from muted to ivory on scroll: *"We don't just record events. We craft films that make you feel everything again — every glance, every laugh, every heartbeat."*
3. **Numbers:** 4 animated counters from CMS (Weddings Filmed, Brands Served, Reels Delivered, Million+ Views).
4. **Services:** pinned horizontal scroll on desktop, vertical stack on mobile. 8 cards: number 01–08, title, one line, hover plays muted preview. Links to `/services#<slug>`.
5. **Featured work:** asymmetric editorial grid of 5–6 featured items. Hover preview, cursor "PLAY", click opens lightbox. "View Full Portfolio" CTA.
6. **Process:** Consult → Plan → Shoot → Edit → Deliver on a gold timeline that draws on scroll.
7. **Testimonials:** slow auto-slide, large italic serif quotes, name, event type, city.
8. **Instagram:** "Follow the story @reel_clicks.in" — 9:16 reels marquee (Behold.so), links to Instagram.
9. **Service areas:** minimal stylised Maharashtra map with glowing gold points on Nandgaon, Manmad, Nashik, Malegaon + "Available all over Maharashtra".
10. **Final CTA:** "Your story deserves a film." Buttons: "Check Date Availability" (WhatsApp prefilled: "Hi, I want to check availability for my date: ") and "Send Enquiry".

SEO: title "REELCLICKS.IN | Cinematic Wedding & Brand Films in Maharashtra", LocalBusiness + VideoObject JSON-LD, OG image.

### PHASE 4 — ABOUT page

1. Hero: split layout, huge serif "We Are Storytellers.", slow-zoom BTS media, label "ABOUT REELCLICKS.IN".
2. Story: editorial two-column text with drop-cap (CMS-editable). Direction: born in North Maharashtra, started with a camera and a passion for real emotion, now a premium studio across Maharashtra.
3. Vision & Mission cards (gold hairline borders):
   - Vision: "To become Maharashtra's most loved cinematic storytelling studio, where every frame feels timeless."
   - Mission: "To turn real moments into premium films and reels through creative direction, cinematic craft and honest service."
4. Values: Emotion First, Cinematic Craft, On-Time Delivery, Client Trust (line icons).
5. Leadership: Huzef Shaikh (Founder), Adil Shaikh (CEO) — portraits grayscale → colour on hover, bio, Call + WhatsApp buttons.
6. BTS draggable horizontal strip.
7. CTA: "Let's create your film."

SEO: "About REELCLICKS.IN | Cinematic Video Studio in Nashik, Maharashtra", Organization + Person schema.

### PHASE 5 — SERVICES page

- Each of the 8 services is its own full section with an anchor (`#wedding-shoots`, etc.).
- Sticky side index on desktop highlighting the active service.
- Each section (alternating left/right): number + large serif title, emotional hook, 2–3 line description, "What's included" list, "Ideal for", 2–3 portfolio videos filtered by category, optional packages (Silver / Gold / Signature, "Starting from ₹___" or "Get Quote", toggle in CMS).
- CTAs: "Enquire on WhatsApp" (prefilled "Hi REELCLICKS, I'm interested in [Service Name].") and "Send Enquiry" (contact form with service pre-selected via query param).
- FAQ accordion at the end (delivery time, travel across Maharashtra, advance/booking, drone, revisions, raw footage) + FAQPage schema.

### PHASE 6 — PORTFOLIO page (premium video gallery)

- Hero: "Our Work" + "Films that feel like memories."
- Filter bar with animated gold underline: All, Weddings, Brand & Promotional, Corporate, Events, Travel & Lifestyle. Smooth layout animation (GSAP Flip / Motion layout). URL updates `?category=`.
- Masonry/editorial grid mixing 16:9 films and 9:16 reels. Desktop hover plays muted preview; mobile tap opens player.
- Lightbox: full-screen black, letterbox, HLS playback with sound, title, category, location, date, client, story, prev/next, share, "Book similar shoot" WhatsApp CTA.
- Case study pages `/portfolio/[slug]`: brief, BTS gallery, final film, testimonial.
- Performance: lazy-load below fold, load video only on interaction, blurred placeholders, "Load more".
- VideoObject schema per item.

### PHASE 7 — TEAM page

- Hero: "The People Behind The Lens."
- Leadership spotlight: Huzef Shaikh — Founder; Adil Shaikh — CEO. Parallax portrait, gold role label, bio, italic quote, Call / WhatsApp / Instagram buttons.
- Optional crew grid from CMS (cinematographers, editors, drone operators).
- Optional gear strip (cameras, drones, gimbals).
- CTA: "Work with us" → contact.

### PHASE 8 — CONTACT page + enquiry form

1. Hero: "Let's Create Something Timeless."
2. Large tappable cards: WhatsApp Huzef, WhatsApp Adil, Call (`tel:+919112626278`, `tel:+919922801923`), Email, Instagram.
3. Enquiry form (floating labels, gold focus line): Name*, Phone/WhatsApp*, Email, Service* (8 options), Event date, City/Location, Budget range, Message.
   - zod + react-hook-form validation, honeypot + Turnstile, rate limit.
   - On submit: save `enquiry` in Sanity, email the agency via Resend, send a thank-you email to the client.
   - Success state: animated gold checkmark + "Continue on WhatsApp" (prefilled with form details).
4. Service areas: "Available all over Maharashtra" + city chips + dark-styled Google Map embed.
5. Business hours + "We reply within 2 hours".
6. LocalBusiness schema (phone, areaServed, sameAs Instagram).

### PHASE 9 — SEO, local pages & tracking

- Per-page meta title/description from CMS, OG images, canonical URLs, `sitemap.xml`, `robots.txt`.
- JSON-LD: LocalBusiness, Organization, Person, VideoObject, FAQPage, BreadcrumbList.
- Local landing pages from `cityPage`: `/wedding-cinematographer-nashik`, `-malegaon`, `-manmad`, `-nandgaon` — unique content, city portfolio, CTA.
- GA4, Meta Pixel, Clarity. Track events: WhatsApp click, call click, form submit, showreel play.

### PHASE 10 — Performance, QA & deployment

- Hero poster first, video streams after; preload fonts; dynamic-import heavy GSAP sections; reduce motion on low-end devices.
- Test on 360px, 390px, 768px, 1280px, 1920px widths. Check reduced-motion mode and keyboard navigation.
- Run Lighthouse; fix anything under 90.
- Write `README.md`: local setup, env variables, Vercel deployment, connecting the `reelclicks.in` domain.
- Write `CLIENT-GUIDE.md` (simple language): how to log in to `/studio`, upload a portfolio video, change images, see enquiries.

---

## 6. CONTENT THE CLIENT MUST PROVIDE (track in PROGRESS.md)

- Logo (SVG preferred)
- Showreel video (60–90s) + 9:16 mobile cut
- Portfolio videos per category, with titles/locations
- Founder & CEO photos + short bios
- Testimonials (text or video)
- Real numbers for counters
- Package details / starting prices (optional)
- Bunny/Mux, Sanity, Resend, Turnstile, Behold, GA4, Meta Pixel accounts/keys
