import { siteConfig } from "@/lib/config";
import { telLink, whatsappLink } from "@/lib/utils";
import { PhoneIcon, WhatsAppIcon } from "@/components/ui/Icons";

/** Sticky bottom bar on mobile: WhatsApp + Call. */
export function MobileBar() {
  return (
    <div className="theme-dark fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-hairline bg-black/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
      <a
        href={whatsappLink()}
        target="_blank"
        rel="noopener noreferrer"
        data-track="whatsapp_click"
        className="flex h-14 items-center justify-center gap-3 bg-red text-sm font-semibold text-black"
      >
        <WhatsAppIcon className="h-5 w-5" />
        WhatsApp
      </a>
      <a
        href={telLink(siteConfig.people.founder.tel)}
        data-track="call_click"
        className="flex h-14 items-center justify-center gap-3 text-sm font-semibold text-paper"
      >
        <PhoneIcon className="h-5 w-5 text-red" />
        Call Now
      </a>
    </div>
  );
}
