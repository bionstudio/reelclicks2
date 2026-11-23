import { siteConfig } from "@/lib/config";
import { telLink, whatsappLink } from "@/lib/utils";
import { PhoneIcon, WhatsAppIcon } from "@/components/ui/Icons";

/** Sticky bottom bar on mobile: WhatsApp + Call. */
export function MobileBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-hairline bg-ink/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
      <a
        href={whatsappLink()}
        target="_blank"
        rel="noopener noreferrer"
        data-track="whatsapp_click"
        className="label flex h-14 items-center justify-center gap-3 bg-gold text-ink"
      >
        <WhatsAppIcon className="h-5 w-5" />
        WhatsApp
      </a>
      <a
        href={telLink(siteConfig.people.founder.tel)}
        data-track="call_click"
        className="label flex h-14 items-center justify-center gap-3 text-ivory"
      >
        <PhoneIcon className="h-5 w-5 text-gold" />
        Call Now
      </a>
    </div>
  );
}
