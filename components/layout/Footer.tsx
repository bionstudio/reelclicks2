import { navigation, services, siteConfig } from "@/lib/config";
import type { SiteSettings } from "@/lib/sanity/types";
import { telLink, whatsappLink } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";
import { InstagramIcon } from "@/components/ui/Icons";
import { TransitionLink } from "@/components/layout/TransitionLink";

export function Footer({ settings, cities = [] }: { settings: SiteSettings; cities?: Array<{ city: string; slug: string }> }) {
  const { founder, ceo } = settings;

  return (
    <footer className="cv-auto relative mt-auto border-t border-hairline bg-ink pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:pb-0">
      <div className="container-cinema pt-20 md:pt-32">
        <p className="label flex items-center gap-2.5 text-paper/60"><span aria-hidden="true" className="h-2 w-2 rounded-full bg-red" />{siteConfig.name}</p>
        <p className="mt-6 max-w-5xl font-display text-[44px] leading-[0.92] text-paper md:text-[88px] xl:text-[112px]">
          Turning moments <em className="text-red">into memories.</em>
        </p>

        <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-12 border-t border-hairline pt-12 md:mt-24 md:grid-cols-12">
          <FooterCol title="Explore" className="md:col-span-2">
            {navigation.map((item) => (
              <li key={item.href}>
                <TransitionLink href={item.href} className="footer-link">
                  {item.label}
                </TransitionLink>
              </li>
            ))}
          </FooterCol>

          <FooterCol title="Services" className="col-span-2 md:col-span-4">
            {services.map((s) => (
              <li key={s.slug}>
                <TransitionLink href={`/services#${s.slug}`} className="footer-link">
                  {s.title}
                </TransitionLink>
              </li>
            ))}
          </FooterCol>

          <FooterCol title="Contact" className="col-span-2 md:col-span-3">
            {[founder, ceo].map((p) => (
              <li key={p.whatsapp} className="pb-3">
                <span className="block text-sm text-paper/60">
                  {p.name} — {p.role}
                </span>
                <span className="flex flex-wrap gap-x-4">
                  <a href={telLink(p.phone)} data-track="call_click" className="footer-link">
                    {p.phone}
                  </a>
                  <a
                    href={whatsappLink(p.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-track="whatsapp_click"
                    className="footer-link font-semibold text-red"
                  >
                    WhatsApp
                  </a>
                </span>
              </li>
            ))}
            <li>
              <a href={`mailto:${settings.email}`} className="footer-link break-all">
                {settings.email}
              </a>
            </li>
          </FooterCol>

          <FooterCol title="Service Areas" className="col-span-2 md:col-span-3">
            <li className="text-sm text-paper">{settings.serviceArea}</li>
            {cities.length ? (
              cities.map((c) => (
                <li key={c.slug}>
                  <TransitionLink href={`/${c.slug}`} className="footer-link text-paper/60 hover:text-red">
                    Wedding films in {c.city}
                  </TransitionLink>
                </li>
              ))
            ) : (
              <li className="text-sm text-paper/60">{settings.locations.join(" · ")}</li>
            )}
            <li className="pt-4">
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link inline-flex items-center gap-3"
              >
                <InstagramIcon className="h-5 w-5 text-red" />
                {settings.instagramHandle}
              </a>
            </li>
          </FooterCol>
        </div>

        <p aria-hidden="true" className="mt-20 overflow-hidden font-display text-[min(15.5vw,250px)] leading-[0.85] font-bold tracking-[-0.06em] whitespace-nowrap text-paper select-none md:mt-28">
          reelclicks<span className="text-red">.in</span>
        </p>

        <div className="mt-8 flex flex-col gap-4 border-t border-hairline py-8 text-xs text-paper/60 md:flex-row md:items-center md:justify-between">
          <Logo className="text-base" />
          <p>© REELCLICKS.IN — All rights reserved.</p>
          <p>Cinematic storytelling across Maharashtra</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <h2 className="label mb-5 text-paper/50">{title}</h2>
      <ul className="space-y-1">{children}</ul>
    </div>
  );
}
