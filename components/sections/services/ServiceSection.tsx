import type { PortfolioItem, Service } from "@/lib/sanity/types";
import { siteConfig } from "@/lib/config";
import { cn, whatsappLink } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { CoverMedia } from "@/components/ui/CoverMedia";
import { RevealMedia } from "@/components/ui/RevealMedia";
import { RevealText } from "@/components/ui/RevealText";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { ServiceWorks } from "./ServiceWorks";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

type Props = {
  service: Service;
  index: number;
  total: number;
  works: PortfolioItem[];
  whatsapp: string;
};

/** One full service section with anchor, details, films, packages and CTAs. */
export function ServiceSection({ service, index, total, works, whatsapp }: Props) {
  const flip = index % 2 === 1;
  const number = String(index + 1).padStart(2, "0");
  const packages = service.showPackages ? service.packages.filter((p) => p.name) : [];

  return (
    <section
      id={service.slug}
      aria-labelledby={`${service.slug}-title`}
      className="scroll-mt-36 border-t border-hairline py-20 md:py-32 lg:scroll-mt-28"
    >
      <div className="grid gap-12 xl:grid-cols-2 xl:gap-16">
        {/* Text */}
        <div className={cn(flip && "xl:order-2")}>
          <p className="label flex items-center gap-4 text-red">
            <span className="font-display text-5xl tracking-normal text-red md:text-6xl">{number}</span>
            <span className="text-paper/60">/ {String(total).padStart(2, "0")}</span>
          </p>
          <RevealText as="h2" className="mt-6 font-display text-[40px] leading-[0.95] text-paper md:text-6xl xl:text-7xl">
            <span id={`${service.slug}-title`}>{service.title}</span>
          </RevealText>
          {service.hook && <p className="mt-6 font-display text-2xl text-red italic md:text-3xl">{service.hook}</p>}
          {service.description && <p className="mt-6 max-w-xl leading-relaxed text-paper/75">{service.description}</p>}

          <div className="mt-10 grid gap-10 sm:grid-cols-2">
            {service.included.length > 0 && (
              <div>
                <h3 className="label text-red">What&apos;s included</h3>
                <ul className="mt-4 space-y-3">
                  {service.included.map((x) => (
                    <li key={x} className="flex gap-3 text-sm text-paper/85">
                      <span aria-hidden="true" className="mt-2.5 h-px w-4 shrink-0 bg-red" />
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {service.idealFor.length > 0 && (
              <div>
                <h3 className="label text-red">Ideal for</h3>
                <ul className="mt-4 space-y-3">
                  {service.idealFor.map((x) => (
                    <li key={x} className="text-sm text-paper/60">
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button
              href={whatsappLink(whatsapp, siteConfig.whatsappMessages.service(service.title))}
              newTab
              data-track="whatsapp_click"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Enquire on WhatsApp
            </Button>
            <Button href={`/contact?service=${service.slug}`} variant="outline">
              Send Enquiry
            </Button>
          </div>
        </div>

        {/* Films */}
        <div className={cn(flip && "xl:order-1")}>
          {works.length ? (
            <ServiceWorks items={works} />
          ) : (
            <RevealMedia className="aspect-4/5">
              <div className="relative h-full w-full">
                <CoverMedia image={service.thumbnail} alt={service.title} variant={index} sizes="(min-width: 1280px) 40vw, 100vw" />
              </div>
            </RevealMedia>
          )}
        </div>
      </div>

      {packages.length > 0 && (
        <div className="mt-16 md:mt-24">
          <h3 className="label text-red">Packages</h3>
          <ul className="mt-6 grid gap-4 md:grid-cols-3">
            {packages.map((p, i) => (
              <li
                key={p.name}
                className={cn(
                  "relative flex flex-col border p-8",
                  i === packages.length - 1 ? "border-red bg-red/5" : "border-red/25",
                )}
              >
                {i === packages.length - 1 && (
                  <span className="label absolute -top-3 left-8 bg-red px-3 py-1 text-[0.6rem] text-black">Most loved</span>
                )}
                <p className="font-display text-3xl text-paper">{p.name}</p>
                <p className="mt-3 text-sm text-paper/60">
                  {p.price ? (
                    <>
                      Starting from <span className="font-display text-2xl text-red">{inr(p.price)}</span>
                    </>
                  ) : (
                    <span className="label text-red">Get Quote</span>
                  )}
                </p>
                {p.features.length > 0 && (
                  <ul className="mt-6 flex-1 space-y-2.5 border-t border-hairline pt-6">
                    {p.features.map((f) => (
                      <li key={f} className="flex gap-3 text-sm text-paper/80">
                        <span aria-hidden="true" className="mt-2.5 h-px w-3 shrink-0 bg-red" />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
                <a
                  href={whatsappLink(whatsapp, `Hi REELCLICKS, I'm interested in the ${p.name} package for ${service.title}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-track="whatsapp_click"
                  className="label mt-8 inline-flex min-h-11 items-center gap-2 text-paper transition-colors hover:text-red"
                >
                  {p.price ? "Book this package" : "Request a quote"} →
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
