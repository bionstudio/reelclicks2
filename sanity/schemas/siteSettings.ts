import { CogIcon } from "@sanity/icons/Cog";
import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  icon: CogIcon,
  groups: [
    { name: "brand", title: "Brand", default: true },
    { name: "contact", title: "Contact" },
    { name: "showreel", title: "Showreel" },
    { name: "seo", title: "Google" },
  ],
  fields: [
    defineField({ name: "logo", title: "Logo", type: "image", group: "brand", description: "SVG or PNG with transparent background." }),
    defineField({ name: "tagline", title: "Tagline", type: "string", group: "brand", initialValue: "Turning Moments Into Memories." }),
    defineField({ name: "email", title: "Email", type: "string", group: "contact", validation: (r) => r.email() }),
    defineField({ name: "founder", title: "Founder", type: "contactPerson", group: "contact" }),
    defineField({ name: "ceo", title: "CEO", type: "contactPerson", group: "contact" }),
    defineField({ name: "instagramHandle", title: "Instagram handle", type: "string", group: "contact", initialValue: "@reel_clicks.in" }),
    defineField({ name: "instagramUrl", title: "Instagram link", type: "url", group: "contact" }),
    defineField({ name: "serviceArea", title: "Service area", type: "string", group: "contact", initialValue: "All over Maharashtra" }),
    defineField({
      name: "locations",
      title: "Main locations",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      group: "contact",
    }),
    defineField({
      name: "businessHours",
      title: "Business hours",
      type: "string",
      group: "contact",
      initialValue: "Mon – Sun · 9:00 AM – 9:00 PM",
    }),
    defineField({ name: "showreel", title: "Showreel (desktop, 16:9)", type: "videoSource", group: "showreel" }),
    defineField({ name: "showreelMobile", title: "Showreel (mobile, 9:16 cut)", type: "videoSource", group: "showreel" }),
    defineField({
      name: "showreelPoster",
      title: "Showreel cover image",
      type: "image",
      group: "showreel",
      description: "Shown instantly while the video loads.",
      options: { hotspot: true },
    }),
    defineField({ name: "seo", title: "Default Google & sharing", type: "seo", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Site Settings" }) },
});
