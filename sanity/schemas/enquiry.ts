import { EnvelopeIcon } from "@sanity/icons/Envelope";
import { defineField, defineType } from "sanity";

export const ENQUIRY_STATUSES = [
  { title: "🟡 New", value: "new" },
  { title: "🔵 Contacted", value: "contacted" },
  { title: "🟢 Booked", value: "booked" },
  { title: "⚪ Closed", value: "closed" },
];

/** Leads submitted through the website contact form (Phase 8). */
export const enquiry = defineType({
  name: "enquiry",
  title: "Enquiry",
  type: "document",
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: { list: ENQUIRY_STATUSES, layout: "radio", direction: "horizontal" },
      initialValue: "new",
    }),
    defineField({ name: "notes", title: "Your notes", type: "text", rows: 3, description: "Private — only visible here." }),
    defineField({ name: "name", title: "Name", type: "string", readOnly: true }),
    defineField({ name: "phone", title: "Phone / WhatsApp", type: "string", readOnly: true }),
    defineField({ name: "email", title: "Email", type: "string", readOnly: true }),
    defineField({ name: "service", title: "Service", type: "string", readOnly: true }),
    defineField({ name: "eventDate", title: "Event date", type: "date", readOnly: true }),
    defineField({ name: "location", title: "City / Location", type: "string", readOnly: true }),
    defineField({ name: "budget", title: "Budget range", type: "string", readOnly: true }),
    defineField({ name: "message", title: "Message", type: "text", readOnly: true }),
    defineField({ name: "submittedAt", title: "Received", type: "datetime", readOnly: true }),
    defineField({ name: "source", title: "Sent from page", type: "string", readOnly: true }),
  ],
  orderings: [{ title: "Newest first", name: "newest", by: [{ field: "submittedAt", direction: "desc" }] }],
  preview: {
    select: { name: "name", service: "service", status: "status", date: "eventDate" },
    prepare: ({ name, service, status, date }) => {
      const s = ENQUIRY_STATUSES.find((x) => x.value === status)?.title.split(" ")[0] ?? "";
      return { title: `${s} ${name ?? "Unnamed"}`, subtitle: [service, date].filter(Boolean).join(" · ") };
    },
  },
});
