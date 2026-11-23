import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { siteConfig } from "@/lib/config";
import { enquirySchema, serviceTitle } from "@/lib/enquiry";
import { getWriteClient } from "@/lib/sanity/client";
import { rateLimit } from "@/lib/server/rate-limit";
import { agencyEmail, clientEmail } from "@/lib/server/emails";

async function verifyTurnstile(token: string | undefined, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // Not configured (local dev) — honeypot + rate limit still apply.
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    });
    const data = (await res.json()) as { success?: boolean };
    return Boolean(data.success);
  } catch {
    return false;
  }
}

/** Receives the contact form: validate → spam checks → save to Sanity → email studio + client. */
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";

  const limit = rateLimit(`enquiry:${ip}`);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many enquiries — please try again in a few minutes, or message us on WhatsApp." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const parsed = enquirySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Please check the form and try again.", fields: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  const data = parsed.data;

  // Honeypot filled → pretend success, drop silently.
  if (data.website) return NextResponse.json({ ok: true });

  if (!(await verifyTurnstile(data.turnstileToken, ip))) {
    return NextResponse.json({ ok: false, error: "Spam check failed — please try again." }, { status: 400 });
  }

  const results = { saved: false, notified: false, confirmed: false };

  // 1. Save the lead in Sanity.
  const sanity = getWriteClient();
  if (sanity) {
    try {
      await sanity.create({
        _type: "enquiry",
        status: "new",
        name: data.name,
        phone: data.phone,
        email: data.email || undefined,
        service: serviceTitle(data.service),
        eventDate: data.eventDate || undefined,
        location: data.location || undefined,
        budget: data.budget || undefined,
        message: data.message || undefined,
        source: data.source,
        submittedAt: new Date().toISOString(),
      });
      results.saved = true;
    } catch (err) {
      console.error("[enquiry] Sanity save failed:", (err as Error).message);
    }
  }

  // 2. Email the studio + thank the client.
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    const resend = new Resend(apiKey);
    const from = process.env.RESEND_FROM_EMAIL || "REELCLICKS.IN <onboarding@resend.dev>";
    const to = process.env.ENQUIRY_TO_EMAIL || siteConfig.email;
    const a = agencyEmail(data);
    const { error } = await resend.emails.send({
      from,
      to,
      subject: a.subject,
      html: a.html,
      ...(data.email ? { replyTo: data.email } : {}),
    });
    if (error) console.error("[enquiry] Agency email failed:", error.message);
    else results.notified = true;

    if (data.email) {
      const c = clientEmail(data);
      const res = await resend.emails.send({ from, to: data.email, subject: c.subject, html: c.html, replyTo: to });
      if (res.error) console.error("[enquiry] Client email failed:", res.error.message);
      else results.confirmed = true;
    }
  }

  // The lead must reach the studio somehow.
  if (!results.saved && !results.notified) {
    console.error("[enquiry] Not delivered — configure SANITY_API_WRITE_TOKEN and/or RESEND_API_KEY.");
    return NextResponse.json(
      { ok: false, error: "We couldn't send your enquiry right now. Please message us on WhatsApp instead." },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true, ...results });
}
