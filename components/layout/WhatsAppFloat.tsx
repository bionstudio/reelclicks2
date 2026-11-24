import { whatsappLink } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/ui/Icons";

/** Floating WhatsApp button (desktop/tablet). Mobile uses the sticky bottom bar. */
export function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with REELCLICKS on WhatsApp"
      data-track="whatsapp_click"
      className="group fixed right-6 bottom-6 z-40 hidden h-14 w-14 items-center justify-center rounded-full bg-red text-black shadow-lg shadow-black/30 transition-transform duration-300 hover:scale-110 md:flex"
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 animate-ping rounded-full border-2 border-red/60 [animation-duration:2.4s]"
      />
      <WhatsAppIcon className="relative h-6 w-6" />
    </a>
  );
}
