# REELCLICKS.IN — Website

Cinematic website for **REELCLICKS.IN**, North Maharashtra's premium storytelling studio.
Next.js (App Router) + Sanity CMS, deployed on Vercel.

- Build brief: [`CLAUDE.md`](CLAUDE.md) · Status and decisions: [`PROGRESS.md`](PROGRESS.md)
- For the studio team (non-technical): [`CLIENT-GUIDE.md`](CLIENT-GUIDE.md)

---

## Tech stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router, Cache Components) + TypeScript |
| Styling | Tailwind CSS v4 — design tokens in `app/globals.css` (`@theme`) |
| Animation | GSAP + ScrollTrigger + SplitText, Lenis, Motion |
| CMS | Sanity v6, Studio embedded at `/studio` |
| Video | HLS via hls.js — Bunny Stream (recommended) or Mux |
| Forms | react-hook-form + zod, Resend email, honeypot + Cloudflare Turnstile + rate limit |
| Analytics | GA4, Meta Pixel, Microsoft Clarity (each optional) |
| Hosting | Vercel |

---

## Local setup

Requirements: **Node.js 20+** (developed on Node 24) and npm.

```bash
npm install
cp .env.example .env.local     # then fill in the values (see below)
npm run dev                    # http://localhost:3000  ·  Studio: http://localhost:3000/studio
```

| Script | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build (run before every deploy) |
| `npm run start` | Serve the production build locally |
| `npm run lint` | ESLint |
| `npm run seed` | Load demo content into Sanity (safe to re-run; never overwrites edits) |
| `npm run seed -- --force` | Reset demo documents back to the demo content |

The site renders complete **demo content** from `lib/sanity/demo.ts` whenever Sanity is not
configured, is empty, or is unreachable — so it never breaks.

---

## Environment variables

All variables are documented in [`.env.example`](.env.example). Put real values in `.env.local`
(never committed) and in **Vercel → Project → Settings → Environment Variables**.

| Variable | Required | Where to get it |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | ✅ | `https://reelclicks.in` in production (used for canonical URLs, sitemap, OG) |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | ✅ | sanity.io/manage → project (`rjptlj55`) |
| `NEXT_PUBLIC_SANITY_DATASET` | ✅ | `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | | defaults to `2026-11-01` |
| `SANITY_API_WRITE_TOKEN` | ✅ | Sanity → API → Tokens → **Editor**. Saves enquiries; used by `npm run seed`. Server-only. |
| `SANITY_REVALIDATE_SECRET` | ✅ | Any long random string. Same value in the Sanity webhook (below). |
| `RESEND_API_KEY` | ✅ for email | resend.com → API Keys |
| `RESEND_FROM_EMAIL` | ✅ for email | e.g. `REELCLICKS.IN <hello@reelclicks.in>` (domain must be verified in Resend) |
| `ENQUIRY_TO_EMAIL` | | Where enquiries are emailed. Defaults to the site email. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | recommended | Cloudflare → Turnstile → Add widget (hostnames: `reelclicks.in`, `localhost`) |
| `NEXT_PUBLIC_BUNNY_STREAM_LIBRARY_ID` / `NEXT_PUBLIC_BUNNY_STREAM_CDN_HOSTNAME` | for video | Bunny → Stream → Library → API (CDN hostname looks like `vz-xxxx.b-cdn.net`) |
| `MUX_TOKEN_ID` / `MUX_TOKEN_SECRET` | optional | Only if using Mux instead of Bunny |
| `NEXT_PUBLIC_BEHOLD_FEED_ID` | optional | behold.so → connect Instagram → JSON feed ID |
| `NEXT_PUBLIC_GA4_ID` | optional | `G-XXXXXXX` |
| `NEXT_PUBLIC_META_PIXEL_ID` | optional | digits only |
| `NEXT_PUBLIC_CLARITY_ID` | optional | Clarity project ID |

Features switch on automatically when their keys are present (Turnstile, Resend, analytics, Behold).

---

## Project structure

```
app/
  layout.tsx              Root shell (fonts, boot script, global metadata)
  (site)/                 Website (header, footer, preloader, cursor, analytics)
    page.tsx              Home
    about/ services/ portfolio/ portfolio/[slug]/ team/ contact/
    [city]/               City landing pages, e.g. /wedding-cinematographer-nashik
  studio/[[...tool]]/     Embedded Sanity Studio
  api/enquiry/            Contact form → Sanity + Resend
  api/revalidate/         Sanity webhook → instant cache refresh
  og/                     Default share image (1200×630)
  sitemap.ts robots.ts
components/
  layout/                 Header, MobileMenu, Footer, Preloader, transitions, smooth scroll
  ui/                     Button, RevealText, RevealMedia, VideoPlayer, Lightbox, …
  sections/               Page sections (home, about, services, team)
  portfolio/ contact/ team/ analytics/ seo/
lib/
  config.ts               Fallback contacts, services, categories, page copy
  sanity/                 client, queries (GROQ), types, cached fetchers, demo content
  seo.ts                  Metadata builder + JSON-LD helpers
  enquiry.ts              Shared zod schema for the contact form
sanity/
  schemas/                Content model · structure.ts (Studio sidebar) · env.ts
scripts/seed.ts           Demo content seeder
```

### Content & caching

- All page data comes from cached fetchers in `lib/sanity/fetch.ts` (`'use cache'` + `cacheTag("sanity")`).
- Publishing in the Studio calls `/api/revalidate`, which expires the cache instantly.
- Without the webhook, content still refreshes within an hour.

---

## Deploying to Vercel

1. Push the repo to GitHub (`.env.local` is git-ignored — keep it that way).
2. vercel.com → **Add New Project** → import the repo. Framework preset: **Next.js** (defaults are fine).
3. Add every environment variable from the table above (Production + Preview).
   Set `NEXT_PUBLIC_SITE_URL=https://reelclicks.in`.
4. Deploy. Check `/`, `/studio`, `/sitemap.xml`, `/robots.txt` and send a test enquiry.

### Sanity settings after the first deploy

- **CORS** — sanity.io/manage → API → CORS origins → add `https://reelclicks.in` and
  `https://www.reelclicks.in` (tick *Allow credentials*). Keep `http://localhost:3000` for local work.
- **Webhook** — API → Webhooks → Create:
  - URL: `https://reelclicks.in/api/revalidate`
  - Dataset: `production` · Trigger on: Create, Update, Delete
  - Projection: `{_type, "slug": slug.current}`
  - Secret: the same value as `SANITY_REVALIDATE_SECRET`
  - HTTP method: POST, API version: `v2021-03-25` or later

### Connecting the `reelclicks.in` domain

1. Vercel → Project → **Settings → Domains** → add `reelclicks.in` and `www.reelclicks.in`
   (choose which one redirects to the other — we recommend `www` → apex).
2. At your domain registrar, add the DNS records **exactly as Vercel shows them**. Typically:
   - `A` record, host `@` → `76.76.21.21`
   - `CNAME` record, host `www` → `cname.vercel-dns.com`
3. Wait for Vercel to show "Valid Configuration" (minutes to a few hours). HTTPS is automatic.
4. Update `NEXT_PUBLIC_SITE_URL` if it changed, and redeploy.

### Email (Resend) on the domain

1. resend.com → Domains → add `reelclicks.in` → add the DNS records it lists (SPF/DKIM) at the registrar.
2. Once verified, set `RESEND_FROM_EMAIL="REELCLICKS.IN <hello@reelclicks.in>"`.
   Until then, Resend's test sender only delivers to the Resend account owner.
3. To switch the public contact email, update **Site Settings → Email** in the Studio
   (and `ENQUIRY_TO_EMAIL` if enquiries should go there).

### Search engines

- Google Search Console → add the domain property → submit `https://reelclicks.in/sitemap.xml`.
- Create/claim the **Google Business Profile** and link it to the website.

---

## Quality notes

Measured locally (Chrome, Lighthouse 12, mobile, applied throttling — Phase 10):

| | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| Home | 82–83 | 100 | 100 | 100 |
| About · Team · Portfolio | 90–91 | 100 | 100 | 100 |
| Services · Contact · City · Case study | 87–89 | 100 | 100 | 100 |

- **LCP 1.8–2.0 s** on every page (target < 2.5 s) · **CLS ≤ 0.004** (target < 0.1).
- The remaining performance gap is main-thread time from the animation libraries during load
  (TBT ≈ 200–450 ms on a 4× throttled CPU). Re-measure on the live Vercel URL with PageSpeed
  Insights — CDN, compression and edge caching usually improve these numbers.
- Tested at 360 / 390 / 768 / 1280 / 1920 px (no horizontal overflow, no console errors, tap
  targets ≥ 44 px), with reduced motion, and by keyboard (skip link, visible focus).
- **Lite mode**: low-memory devices and Data Saver users get reduced motion, no smooth scroll,
  no film grain and no background video.

---

## Before launch — checklist

- [ ] Replace demo **testimonials** and **numbers** with real ones (Studio)
- [ ] Upload the **showreel** (16:9 + 9:16 cut + cover image) and real **portfolio videos**
- [ ] Upload **logo**, leader **portraits** and **bios**
- [ ] Review the four **city pages** copy; add real local venue names
- [ ] Set **Resend** (verified domain) and **Turnstile** keys; send a test enquiry
- [ ] Add **GA4 / Meta Pixel / Clarity** IDs (optional)
- [ ] Vercel env vars, domain, Sanity CORS + webhook (above)
- [ ] Submit the sitemap in Google Search Console
