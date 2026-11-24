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
          className="mt-8 max-w-6xl font-display text-[52px] leading-[0.92] text-paper md:text-[110px] xl:text-[150px]"
        >
          Let&apos;s Create
          <br />
          <em className="text-red">Something Timeless.</em>
        </RevealText>
        <p className="mt-10 flex items-center gap-3 text-lg text-paper/60">
          <span aria-hidden="true" className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red" />
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
            <h2 id="enquiry-title" className="mt-6 font-display text-[44px] leading-[0.95] md:text-6xl">
              Tell us about <em className="text-red">your story.</em>
            </h2>
            <dl className="mt-12 space-y-8 border-t border-hairline pt-8">
              <div>
                <dt className="label text-red">Business hours</dt>
                <dd className="mt-2 text-paper">{settings.businessHours}</dd>
              </div>
              <div>
                <dt className="label text-red">Response time</dt>
                <dd className="mt-2 text-paper">We reply within 2 hours</dd>
              </div>
              <div>
                <dt className="label text-red">Booking</dt>
                <dd className="mt-2 text-paper/60">Dates are confirmed on a first-come basis once the advance is received.</dd>
              </div>
            </dl>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <EnquiryForm whatsapp={settings.founder.whatsapp} />
          </div>
        </div>
      </section>

      {/* Service areas + map */}
      <section className="theme-light py-24 md:py-36" aria-labelledby="areas-title">
        <div className="container-cinema grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionLabel>Service Areas</SectionLabel>
            <h2 id="areas-title" className="mt-6 font-display text-[44px] leading-[0.95] md:text-6xl">
              Available <em className="text-red">all over Maharashtra.</em>
            </h2>
            <ul className="mt-10 flex flex-wrap gap-3">
              {settings.locations.map((l) => (
                <li key={l} className="rounded-full border border-hairline px-4 py-2.5 text-sm font-semibold text-paper">
                  {l}
                </li>
              ))}
              <li className="rounded-full bg-red px-4 py-2.5 text-sm font-semibold text-black">{settings.serviceArea}</li>
            </ul>
          </div>
          <div className="relative aspect-4/3 overflow-hidden rounded-3xl border border-hairline lg:col-span-7">
            <iframe
              title={`Map of ${settings.locations.join(", ")}, Maharashtra`}
              src={`https://www.google.com/maps?q=${mapQuery}&z=8&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full filter-[grayscale(1)_contrast(1.05)]"
            />
            <span aria-hidden="true" className="pointer-events-none absolute inset-0 shadow-[inset_0_0_80px_rgba(10,10,10,0.8)]" />
          </div>
        </div>
      </section>
    </>
  );
}
