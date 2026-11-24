import { siteConfig } from "@/lib/config";
import { whatsappLink } from "@/lib/utils";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { RevealText } from "@/components/ui/RevealText";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/Icons";

/** Closing call to action on REC red. */
export function FinalCta({ title, whatsapp }: { title: string; whatsapp: string }) {
  return (
    <section className="theme-red cv-auto relative overflow-hidden" aria-labelledby="final-cta-title">

      <div className="container-cinema relative flex min-h-[70svh] flex-col items-center justify-center py-32 text-center md:py-40">
        <SectionLabel line={false}>Now Booking · All Over Maharashtra</SectionLabel>
        <RevealText
          as="h2"
          className="mt-8 max-w-6xl font-display text-[14vw] leading-[0.88] font-bold sm:text-[80px] md:text-[120px] xl:text-[168px]"
        >
          <span id="final-cta-title">{title}</span>
        </RevealText>
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Button
            href={whatsappLink(whatsapp, siteConfig.whatsappMessages.availability)}
            newTab
            size="lg"
            data-track="whatsapp_click"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Check Date Availability
          </Button>
          <Button href="/contact" variant="outline" size="lg" className="border-black/40">
            Send Enquiry
          </Button>
        </div>
      </div>
    </section>
  );
}
