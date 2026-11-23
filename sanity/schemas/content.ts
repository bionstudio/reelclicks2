import { BarChartIcon } from "@sanity/icons/BarChart";
import { CommentIcon } from "@sanity/icons/Comment";
import { DocumentIcon } from "@sanity/icons/Document";
import { HelpCircleIcon } from "@sanity/icons/HelpCircle";
import { PinIcon } from "@sanity/icons/Pin";
import { PlayIcon } from "@sanity/icons/Play";
import { TagIcon } from "@sanity/icons/Tag";
import { UsersIcon } from "@sanity/icons/Users";
import { WrenchIcon } from "@sanity/icons/Wrench";
import { orderRankField, orderRankOrdering } from "@sanity/orderable-document-list";
import { defineArrayMember, defineField, defineType } from "sanity";

const PAGE_KEYS = [
  { title: "Home", value: "home" },
  { title: "About", value: "about" },
  { title: "Services", value: "services" },
  { title: "Portfolio", value: "portfolio" },
  { title: "Team", value: "team" },
  { title: "Contact", value: "contact" },
];

/** Per-page settings: Google/sharing fields and a few editable texts. */
export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({ name: "title", title: "Page name", type: "string", readOnly: true }),
    defineField({
      name: "key",
      title: "Page",
      type: "string",
      options: { list: PAGE_KEYS },
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: "manifesto",
      title: "Manifesto (big paragraph under the hero)",
      type: "text",
      rows: 3,
      hidden: ({ document }) => document?.key !== "home",
    }),
    defineField({
      name: "finalCtaTitle",
      title: "Closing headline",
      type: "string",
      description: "e.g. “Your story deserves a film.”",
      hidden: ({ document }) => document?.key !== "home",
    }),
    defineField({
      name: "heroImage",
      title: "Hero image (behind the scenes)",
      type: "altImage",
      hidden: ({ document }) => document?.key !== "about",
    }),
    defineField({
      name: "story",
      title: "Our story (About page)",
      type: "array",
      of: [defineArrayMember({ type: "block", styles: [{ title: "Normal", value: "normal" }] })],
      hidden: ({ document }) => document?.key !== "about",
    }),
    defineField({
      name: "vision",
      title: "Vision",
      type: "text",
      rows: 2,
      hidden: ({ document }) => document?.key !== "about",
    }),
    defineField({
      name: "mission",
      title: "Mission",
      type: "text",
      rows: 2,
      hidden: ({ document }) => document?.key !== "about",
    }),
    defineField({
      name: "values",
      title: "Our values",
      type: "array",
      hidden: ({ document }) => document?.key !== "about",
      validation: (r) => r.max(4),
      of: [
        defineArrayMember({
          type: "object",
          name: "value",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "text", title: "Short description", type: "text", rows: 2 }),
          ],
        }),
      ],
    }),
    defineField({
      name: "gear",
      title: "Our gear (Team page strip)",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      description: "e.g. Cinema cameras, 4K drones, Gimbals. Leave empty to hide the strip.",
      hidden: ({ document }) => document?.key !== "team",
    }),
    defineField({
      name: "gallery",
      title: "Behind-the-scenes photos",
      type: "array",
      of: [defineArrayMember({ type: "altImage" })],
      options: { layout: "grid" },
      hidden: ({ document }) => document?.key !== "about",
    }),
    defineField({ name: "seo", title: "Google & Social Sharing", type: "seo" }),
  ],
});

export const category = defineType({
  name: "category",
  title: "Portfolio Category",
  type: "document",
  icon: TagIcon,
  orderings: [orderRankOrdering],
  fields: [
    defineField({ name: "title", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Web address",
      type: "slug",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
    orderRankField({ type: "category" }),
  ],
});

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  icon: WrenchIcon,
  orderings: [orderRankOrdering],
  groups: [
    { name: "main", title: "Main", default: true },
    { name: "details", title: "Details" },
    { name: "packages", title: "Packages" },
    { name: "seo", title: "Google" },
  ],
  fields: [
    defineField({ name: "title", title: "Service name", type: "string", group: "main", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Web address",
      type: "slug",
      group: "main",
      options: { source: "title" },
      description: "Used for the link /services#this-value",
      validation: (r) => r.required(),
    }),
    defineField({ name: "shortLine", title: "One-line summary (Home page card)", type: "string", group: "main" }),
    defineField({ name: "hook", title: "Emotional hook", type: "string", group: "main", description: "A short, feeling line, e.g. “The day you’ll want to relive forever.”" }),
    defineField({ name: "description", title: "Description", type: "text", rows: 4, group: "main" }),
    defineField({ name: "thumbnail", title: "Card image", type: "altImage", group: "main" }),
    defineField({ name: "previewVideo", title: "Hover preview video (short, muted)", type: "videoSource", group: "main" }),
    defineField({
      name: "category",
      title: "Show portfolio videos from",
      type: "reference",
      to: [{ type: "category" }],
      group: "details",
    }),
    defineField({ name: "included", title: "What's included", type: "array", of: [{ type: "string" }], group: "details" }),
    defineField({ name: "idealFor", title: "Ideal for", type: "array", of: [{ type: "string" }], group: "details" }),
    defineField({
      name: "showPackages",
      title: "Show packages on the website",
      type: "boolean",
      initialValue: false,
      group: "packages",
    }),
    defineField({
      name: "packages",
      title: "Packages",
      type: "array",
      group: "packages",
      hidden: ({ document }) => !document?.showPackages,
      of: [
        defineArrayMember({
          type: "object",
          name: "package",
          fields: [
            defineField({
              name: "name",
              title: "Package name",
              type: "string",
              options: { list: ["Silver", "Gold", "Signature"] },
            }),
            defineField({
              name: "price",
              title: "Starting price (₹)",
              type: "number",
              description: "Leave empty to show “Get Quote”.",
            }),
            defineField({ name: "features", title: "Includes", type: "array", of: [{ type: "string" }] }),
          ],
          preview: { select: { title: "name", price: "price" }, prepare: ({ title, price }) => ({ title, subtitle: price ? `From ₹${price}` : "Get Quote" }) },
        }),
      ],
    }),
    defineField({ name: "seo", title: "Google & Social Sharing", type: "seo", group: "seo" }),
    orderRankField({ type: "service" }),
  ],
  preview: { select: { title: "title", subtitle: "shortLine", media: "thumbnail" } },
});

export const portfolioItem = defineType({
  name: "portfolioItem",
  title: "Portfolio Video",
  type: "document",
  icon: PlayIcon,
  orderings: [orderRankOrdering],
  groups: [
    { name: "main", title: "Main", default: true },
    { name: "story", title: "Story & Case Study" },
    { name: "seo", title: "Google" },
  ],
  fields: [
    defineField({ name: "title", title: "Title", type: "string", group: "main", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Web address",
      type: "slug",
      group: "main",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      group: "main",
      validation: (r) => r.required(),
    }),
    defineField({ name: "thumbnail", title: "Cover image", type: "altImage", group: "main" }),
    defineField({ name: "video", title: "Full video", type: "videoSource", group: "main" }),
    defineField({ name: "previewVideo", title: "Hover preview (optional short clip)", type: "videoSource", group: "main" }),
    defineField({
      name: "aspectRatio",
      title: "Video shape",
      type: "string",
      group: "main",
      options: {
        list: [
          { title: "Wide film (16:9)", value: "16:9" },
          { title: "Vertical reel (9:16)", value: "9:16" },
        ],
        layout: "radio",
      },
      initialValue: "16:9",
    }),
    defineField({
      name: "featured",
      title: "Show on Home page",
      type: "boolean",
      group: "main",
      initialValue: false,
    }),
    defineField({ name: "location", title: "Location", type: "string", group: "main" }),
    defineField({ name: "date", title: "Shoot date", type: "date", group: "main" }),
    defineField({ name: "client", title: "Client / couple name", type: "string", group: "main" }),
    defineField({ name: "story", title: "Short story", type: "text", rows: 3, group: "story" }),
    defineField({
      name: "brief",
      title: "Case study: the brief",
      type: "array",
      of: [defineArrayMember({ type: "block", styles: [{ title: "Normal", value: "normal" }] })],
      group: "story",
    }),
    defineField({
      name: "bts",
      title: "Behind-the-scenes photos",
      type: "array",
      of: [defineArrayMember({ type: "altImage" })],
      options: { layout: "grid" },
      group: "story",
    }),
    defineField({
      name: "testimonial",
      title: "Client testimonial",
      type: "reference",
      to: [{ type: "testimonial" }],
      group: "story",
    }),
    defineField({ name: "seo", title: "Google & Social Sharing", type: "seo", group: "seo" }),
    orderRankField({ type: "portfolioItem" }),
  ],
  preview: {
    select: { title: "title", category: "category.title", location: "location", media: "thumbnail", featured: "featured" },
    prepare: ({ title, category, location, media, featured }) => ({
      title: `${featured ? "★ " : ""}${title}`,
      subtitle: [category, location].filter(Boolean).join(" · "),
      media,
    }),
  },
});

export const teamMember = defineType({
  name: "teamMember",
  title: "Team Member",
  type: "document",
  icon: UsersIcon,
  orderings: [orderRankOrdering],
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "role", title: "Role", type: "string", description: "e.g. Founder, CEO, Cinematographer, Editor, Drone Operator" }),
    defineField({
      name: "isLeader",
      title: "Leadership (Founder / CEO)",
      type: "boolean",
      description: "Leaders get a large spotlight on the About and Team pages.",
      initialValue: false,
    }),
    defineField({ name: "photo", title: "Portrait", type: "altImage" }),
    defineField({ name: "bio", title: "Short bio", type: "text", rows: 4 }),
    defineField({ name: "quote", title: "Personal quote", type: "string" }),
    defineField({ name: "phone", title: "Phone", type: "string" }),
    defineField({ name: "whatsapp", title: "WhatsApp (digits only, e.g. 919112626278)", type: "string" }),
    defineField({ name: "instagram", title: "Instagram link", type: "url" }),
    orderRankField({ type: "teamMember" }),
  ],
  preview: { select: { title: "name", subtitle: "role", media: "photo" } },
});

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  icon: CommentIcon,
  orderings: [orderRankOrdering],
  fields: [
    defineField({ name: "quote", title: "What they said", type: "text", rows: 4, validation: (r) => r.required() }),
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "eventType", title: "Event type", type: "string", description: "e.g. Wedding, Brand Film, Corporate Event" }),
    defineField({ name: "city", title: "City", type: "string" }),
    defineField({ name: "video", title: "Video testimonial (optional)", type: "videoSource" }),
    orderRankField({ type: "testimonial" }),
  ],
  preview: { select: { title: "name", subtitle: "quote" } },
});

export const stat = defineType({
  name: "stat",
  title: "Number / Counter",
  type: "document",
  icon: BarChartIcon,
  orderings: [orderRankOrdering],
  fields: [
    defineField({ name: "label", title: "Label", type: "string", description: "e.g. Weddings Filmed", validation: (r) => r.required() }),
    defineField({ name: "value", title: "Number", type: "number", validation: (r) => r.required().min(0) }),
    defineField({ name: "suffix", title: "After the number", type: "string", description: "e.g. + or M+" }),
    orderRankField({ type: "stat" }),
  ],
  preview: {
    select: { label: "label", value: "value", suffix: "suffix" },
    prepare: ({ label, value, suffix }) => ({ title: `${value ?? ""}${suffix ?? ""}`, subtitle: label }),
  },
});

export const faq = defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  icon: HelpCircleIcon,
  orderings: [orderRankOrdering],
  fields: [
    defineField({ name: "question", title: "Question", type: "string", validation: (r) => r.required() }),
    defineField({ name: "answer", title: "Answer", type: "text", rows: 4, validation: (r) => r.required() }),
    orderRankField({ type: "faq" }),
  ],
  preview: { select: { title: "question", subtitle: "answer" } },
});

export const cityPage = defineType({
  name: "cityPage",
  title: "City Page",
  type: "document",
  icon: PinIcon,
  fields: [
    defineField({ name: "city", title: "City", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Web address",
      type: "slug",
      description: "e.g. wedding-cinematographer-nashik",
      options: { source: (doc) => `wedding-cinematographer-${String(doc.city ?? "")}` },
      validation: (r) => r.required(),
    }),
    defineField({ name: "headline", title: "Headline", type: "string" }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 3 }),
    defineField({
      name: "body",
      title: "Page text",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
      description: "Write unique text for each city — Google rewards original content.",
    }),
    defineField({
      name: "portfolio",
      title: "Portfolio videos to show",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "portfolioItem" }] })],
    }),
    defineField({ name: "seo", title: "Google & Social Sharing", type: "seo" }),
  ],
  preview: { select: { title: "city", subtitle: "slug.current" } },
});
