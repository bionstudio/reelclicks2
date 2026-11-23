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
      className="group fixed right-6 bottom-6 z-40 hidden h-14 w-14 items-center justify-center rounded-full border border-gold bg-ink/80 text-gold backdrop-blur transition-colors duration-500 hover:bg-gold hover:text-ink md:flex"
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 animate-ping rounded-full border border-gold/50 [animation-duration:2.4s]"
      />
      <WhatsAppIcon className="relative h-6 w-6" />
    </a>
  );
}
