import type { Metadata } from "next";
import { getPage, getSiteSettings } from "@/lib/sanity/fetch";
import { breadcrumbJsonLd, buildMetadata, localBusinessJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { RevealText } from "@/components/ui/RevealText";
import { ContactCards } from "@/components/contact/ContactCards";
import { EnquiryForm } from "@/components/contact/EnquiryForm";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("contact");
  return buildMetadata({
    seo: page.seo,
    title: "Contact REELCLICKS.IN | Book Your Shoot in Maharashtra",
    description:
      "Check your date and book a wedding, brand or event shoot anywhere in Maharashtra. WhatsApp, call or send an enquiry — we reply within 2 hours.",
    path: "/contact",
    absoluteTitle: true,
  });
}

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const mapQuery = encodeURIComponent(`${settings.locations[0] ?? "Nashik"}, Maharashtra, India`);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }])} />
      <JsonLd data={localBusinessJsonLd(settings)} />

      {/* Hero */}
      <section className="container-cinema pt-40 pb-16 md:pt-52 md:pb-24">
        <SectionLabel>Contact</SectionLabel>
        <RevealText
          as="h1"
          trigger="mount"
          className="mt-8 max-w-6xl font-display text-[52px] leading-[0.92] font-light text-ivory md:text-[110px] xl:text-[150px]"
        >
          Let&apos;s Create
          <br />
          <em className="text-gold-soft">Something Timeless.</em>
        </RevealText>
        <p className="mt-10 flex items-center gap-3 text-lg text-muted">
          <span aria-hidden="true" className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-gold" />
          </span>
          We reply within 2 hours.
        </p>
      </section>

      {/* Contact cards */}
      <section className="container-cinema pb-24 md:pb-36" aria-label="Contact options">
        <ContactCards settings={settings} />
      </section>

      {/* Form */}
      <section id="enquiry" className="scroll-mt-28 border-t border-hairline py-24 md:py-36" aria-labelledby="enquiry-title">
        <div className="container-cinema grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionLabel>Send An Enquiry</SectionLabel>
            <h2 id="enquiry-title" className="mt-6 font-display text-[44px] leading-[0.95] font-light md:text-6xl">
              Tell us about <em className="text-gold-soft">your story.</em>
            </h2>
            <dl className="mt-12 space-y-8 border-t border-hairline pt-8">
              <div>
                <dt className="label text-gold">Business hours</dt>
                <dd className="mt-2 text-ivory">{settings.businessHours}</dd>
              </div>
              <div>
                <dt className="label text-gold">Response time</dt>
                <dd className="mt-2 text-ivory">We reply within 2 hours</dd>
              </div>
              <div>
                <dt className="label text-gold">Booking</dt>
                <dd className="mt-2 text-muted">Dates are confirmed on a first-come basis once the advance is received.</dd>
              </div>
            </dl>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <EnquiryForm whatsapp={settings.founder.whatsapp} />
          </div>
        </div>
      </section>

      {/* Service areas + map */}
      <section className="border-t border-hairline py-24 md:py-36" aria-labelledby="areas-title">
        <div className="container-cinema grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionLabel>Service Areas</SectionLabel>
            <h2 id="areas-title" className="mt-6 font-display text-[44px] leading-[0.95] font-light md:text-6xl">
              Available <em className="text-gold-soft">all over Maharashtra.</em>
            </h2>
            <ul className="mt-10 flex flex-wrap gap-3">
              {settings.locations.map((l) => (
                <li key={l} className="label rounded-full border border-gold/40 px-4 py-2.5 text-ivory">
                  {l}
                </li>
              ))}
              <li className="label rounded-full bg-gold px-4 py-2.5 text-ink">{settings.serviceArea}</li>
            </ul>
          </div>
          <div className="relative aspect-4/3 overflow-hidden border border-hairline lg:col-span-7">
            <iframe
              title={`Map of ${settings.locations.join(", ")}, Maharashtra`}
              src={`https://www.google.com/maps?q=${mapQuery}&z=8&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full filter-[grayscale(1)_invert(0.92)_contrast(0.9)_brightness(0.9)]"
            />
            <span aria-hidden="true" className="pointer-events-none absolute inset-0 shadow-[inset_0_0_80px_rgba(10,10,10,0.8)]" />
          </div>
        </div>
      </section>
    </>
  );
}
