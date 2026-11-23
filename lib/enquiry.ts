import { z } from "zod";
import { services } from "@/lib/config";

/** Shared by the contact form (client) and /api/enquiry (server). */

export const BUDGETS = [
  "Under ₹50,000",
  "₹50,000 – ₹1,00,000",
  "₹1,00,000 – ₹2,50,000",
  "₹2,50,000 – ₹5,00,000",
  "₹5,00,000+",
  "Not sure yet",
] as const;

const serviceSlugs = services.map((s) => s.slug) as [string, ...string[]];

export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80, "That name is a little long"),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s()-]{10,18}$/, "Please enter a valid phone / WhatsApp number"),
  email: z.union([z.literal(""), z.email("Please enter a valid email")]).optional(),
  service: z.enum(serviceSlugs, { error: "Please choose a service" }),
  eventDate: z
    .string()
    .optional()
    .refine((v) => !v || /^\d{4}-\d{2}-\d{2}$/.test(v), "Please choose a valid date"),
  location: z.string().trim().max(80).optional(),
  budget: z.union([z.literal(""), z.enum(BUDGETS)]).optional(),
  message: z.string().trim().max(2000, "Please keep your message under 2000 characters").optional(),
  /** Honeypot — real people never fill this in. Checked on the server, never shown as an error. */
  website: z.string().max(500).optional(),
  /** Cloudflare Turnstile token (when enabled). */
  turnstileToken: z.string().optional(),
  /** Page the form was sent from. */
  source: z.string().max(200).optional(),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

export const serviceTitle = (slug: string) => services.find((s) => s.slug === slug)?.title ?? slug;

/** WhatsApp message prefilled with the enquiry details (success state). */
export function enquiryWhatsappText(d: EnquiryInput) {
  const lines = [
    `Hi REELCLICKS, I just sent an enquiry on your website.`,
    `Name: ${d.name}`,
    `Service: ${serviceTitle(d.service)}`,
    d.eventDate ? `Date: ${d.eventDate}` : "",
    d.location ? `Location: ${d.location}` : "",
    d.budget ? `Budget: ${d.budget}` : "",
    d.message ? `Message: ${d.message}` : "",
  ];
  return lines.filter(Boolean).join("\n");
}
