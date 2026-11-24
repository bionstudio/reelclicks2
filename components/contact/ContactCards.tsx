import type { ReactNode } from "react";
import type { SiteSettings } from "@/lib/sanity/types";
import { telLink, whatsappLink } from "@/lib/utils";
import { ArrowIcon, InstagramIcon, MailIcon, PhoneIcon, WhatsAppIcon } from "@/components/ui/Icons";

type Card = { label: string; value: string; href: string; icon: ReactNode; external?: boolean; track?: string; primary?: boolean };

/** Large tappable contact cards. */
export function ContactCards({ settings }: { settings: SiteSettings }) {
  const { founder, ceo } = settings;
  const first = (n: string) => n.split(" ")[0];

  const cards: Card[] = [
    { label: `WhatsApp ${first(founder.name)}`, value: `${founder.role} · ${founder.phone}`, href: whatsappLink(founder.whatsapp), icon: <WhatsAppIcon className="h-6 w-6" />, external: true, track: "whatsapp_click", primary: true },
    { label: `WhatsApp ${first(ceo.name)}`, value: `${ceo.role} · ${ceo.phone}`, href: whatsappLink(ceo.whatsapp), icon: <WhatsAppIcon className="h-6 w-6" />, external: true, track: "whatsapp_click", primary: true },
    { label: `Call ${first(founder.name)}`, value: founder.phone, href: telLink(founder.phone), icon: <PhoneIcon className="h-6 w-6" />, track: "call_click" },
    { label: `Call ${first(ceo.name)}`, value: ceo.phone, href: telLink(ceo.phone), icon: <PhoneIcon className="h-6 w-6" />, track: "call_click" },
    { label: "Email", value: settings.email, href: `mailto:${settings.email}`, icon: <MailIcon className="h-6 w-6" /> },
    { label: "Instagram", value: settings.instagramHandle, href: settings.instagramUrl, icon: <InstagramIcon className="h-6 w-6" />, external: true },
  ];

  return (
    <ul className="grid gap-px border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((c) => (
        <li key={c.label} className="bg-ink">
          <a
            href={c.href}
            {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            data-track={c.track}
            className="group relative flex min-h-36 flex-col justify-between gap-8 overflow-hidden p-7 transition-colors duration-500 hover:bg-surface md:min-h-44 md:p-9"
          >
            <span
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-red transition-transform duration-700 ease-expo-out group-hover:scale-x-100"
            />
            <span className="flex items-center justify-between">
              <span className={c.primary ? "text-red" : "text-paper/80"}>{c.icon}</span>
              <ArrowIcon className="h-5 w-5 -rotate-45 text-paper/60 transition-all duration-500 group-hover:rotate-0 group-hover:text-red" />
            </span>
            <span>
              <span className="block font-display text-3xl text-paper md:text-4xl">{c.label}</span>
              <span className="mt-2 block text-sm break-all text-paper/60">{c.value}</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
