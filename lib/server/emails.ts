import { siteConfig } from "@/lib/config";
import { serviceTitle, type EnquiryInput } from "@/lib/enquiry";
import { whatsappLink } from "@/lib/utils";

const esc = (s = "") =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function layout(title: string, body: string) {
  return `<!doctype html><html><body style="margin:0;background:#0A0A0A;font-family:Helvetica,Arial,sans-serif;color:#F3EEE6">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A0A;padding:32px 16px"><tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#141414;border:1px solid rgba(201,169,110,.3)">
<tr><td style="padding:28px 32px;border-bottom:1px solid rgba(201,169,110,.25)">
<span style="font-family:Georgia,serif;font-size:20px;letter-spacing:4px;color:#F3EEE6">REELCLICKS<span style="color:#C9A96E">.IN</span></span>
</td></tr>
<tr><td style="padding:32px">
<h1 style="margin:0 0 20px;font-family:Georgia,serif;font-weight:normal;font-size:28px;line-height:1.2;color:#F3EEE6">${title}</h1>
${body}
</td></tr>
<tr><td style="padding:20px 32px;border-top:1px solid rgba(201,169,110,.25);font-size:12px;color:#8A857C">
${esc(siteConfig.tagline)} · ${esc(siteConfig.serviceArea)}
</td></tr></table></td></tr></table></body></html>`;
}

const row = (k: string, v?: string) =>
  v
    ? `<tr><td style="padding:8px 0;color:#C9A96E;font-size:11px;letter-spacing:2px;text-transform:uppercase;width:140px;vertical-align:top">${k}</td><td style="padding:8px 0;color:#F3EEE6;font-size:15px">${esc(v).replace(/\n/g, "<br>")}</td></tr>`
    : "";

/** Email to the studio. */
export function agencyEmail(d: EnquiryInput) {
  const phoneDigits = d.phone.replace(/\D/g, "");
  const wa = whatsappLink(phoneDigits.length === 10 ? `91${phoneDigits}` : phoneDigits, `Hi ${d.name}, thank you for contacting REELCLICKS.IN!`);
  return {
    subject: `New enquiry: ${serviceTitle(d.service)} — ${d.name}`,
    html: layout(
      `New enquiry from ${esc(d.name)}`,
      `<table width="100%" cellpadding="0" cellspacing="0">
${row("Service", serviceTitle(d.service))}
${row("Phone", d.phone)}
${row("Email", d.email)}
${row("Event date", d.eventDate)}
${row("Location", d.location)}
${row("Budget", d.budget)}
${row("Message", d.message)}
${row("Sent from", d.source)}
</table>
<p style="margin:28px 0 0"><a href="${esc(wa)}" style="display:inline-block;background:#C9A96E;color:#0A0A0A;text-decoration:none;padding:14px 24px;font-size:12px;letter-spacing:2px;text-transform:uppercase">Reply on WhatsApp</a></p>
<p style="margin:16px 0 0;font-size:13px;color:#8A857C">Also saved in the admin panel → Enquiries → New.</p>`,
    ),
  };
}

/** Thank-you email to the client. */
export function clientEmail(d: EnquiryInput) {
  const first = esc(d.name.split(" ")[0]);
  return {
    subject: "Thank you — REELCLICKS.IN has received your enquiry",
    html: layout(
      `Thank you, ${first}.`,
      `<p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#F3EEE6">We've received your enquiry for <strong style="color:#E6D3A3">${esc(serviceTitle(d.service))}</strong>${d.eventDate ? ` on <strong style="color:#E6D3A3">${esc(d.eventDate)}</strong>` : ""}. Our team usually replies within 2 hours.</p>
<p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#8A857C">Can't wait? Message us directly on WhatsApp and we'll check your date right away.</p>
<p style="margin:0"><a href="${esc(whatsappLink())}" style="display:inline-block;background:#C9A96E;color:#0A0A0A;text-decoration:none;padding:14px 24px;font-size:12px;letter-spacing:2px;text-transform:uppercase">Chat on WhatsApp</a></p>
<p style="margin:28px 0 0;font-family:Georgia,serif;font-style:italic;font-size:18px;color:#E6D3A3">Turning moments into memories.</p>`,
    ),
  };
}
