import { defineField, defineType } from "sanity";

/** Search & sharing fields reused on pages, services, portfolio and city pages. */
export const seo = defineType({
  name: "seo",
  title: "Google & Social Sharing",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "metaTitle",
      title: "Google title",
      type: "string",
      description: "Shown as the blue link on Google. Keep under 60 characters.",
      validation: (r) => r.max(70).warning("Long titles get cut off on Google."),
    }),
    defineField({
      name: "metaDescription",
      title: "Google description",
      type: "text",
      rows: 3,
      description: "The short grey text under the title on Google. Around 150 characters.",
      validation: (r) => r.max(170).warning("Long descriptions get cut off on Google."),
    }),
    defineField({
      name: "ogImage",
      title: "Sharing image",
      type: "image",
      description: "Shown when the page is shared on WhatsApp, Instagram or Facebook. 1200 × 630 px.",
    }),
    defineField({
      name: "noIndex",
      title: "Hide from Google",
      type: "boolean",
      initialValue: false,
    }),
  ],
});

/** A video hosted on Bunny Stream, Mux, or any direct HLS/MP4 link. */
export const videoSource = defineType({
  name: "videoSource",
  title: "Video",
  type: "object",
  fields: [
    defineField({
      name: "provider",
      title: "Where is the video hosted?",
      type: "string",
      options: {
        list: [
          { title: "Bunny Stream (recommended)", value: "bunny" },
          { title: "Mux", value: "mux" },
          { title: "Direct link (.m3u8 or .mp4)", value: "url" },
        ],
        layout: "radio",
      },
      initialValue: "bunny",
    }),
    defineField({
      name: "bunnyId",
      title: "Bunny video ID",
      type: "string",
      description: "In Bunny → Stream → your video → copy the “Video ID”.",
      hidden: ({ parent }) => parent?.provider !== "bunny",
    }),
    defineField({
      name: "muxPlaybackId",
      title: "Mux playback ID",
      type: "string",
      hidden: ({ parent }) => parent?.provider !== "mux",
    }),
    defineField({
      name: "url",
      title: "Video link",
      type: "url",
      hidden: ({ parent }) => parent?.provider !== "url",
    }),
  ],
});

/** Contact person used in Site Settings (Founder / CEO). */
export const contactPerson = defineType({
  name: "contactPerson",
  title: "Contact person",
  type: "object",
  fields: [
    defineField({ name: "name", title: "Name", type: "string" }),
    defineField({ name: "role", title: "Role", type: "string" }),
    defineField({
      name: "phone",
      title: "Phone number",
      type: "string",
      description: "As it should appear on the site, e.g. +91 91126 26278",
    }),
    defineField({
      name: "whatsapp",
      title: "WhatsApp number",
      type: "string",
      description: "Digits only with country code, e.g. 919112626278",
      validation: (r) => r.regex(/^\d{10,15}$/, { name: "digits" }),
    }),
  ],
  preview: { select: { title: "name", subtitle: "role" } },
});

/** Image with alt text. */
export const altImage = defineType({
  name: "altImage",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Short description (for blind visitors & Google)",
      type: "string",
    }),
  ],
});
