import { siteConfig } from "@/lib/config";
import { whatsappLink } from "@/lib/utils";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { RevealText } from "@/components/ui/RevealText";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/Icons";

/** Closing call to action — letterboxed, cinematic. */
export function FinalCta({ title, whatsapp }: { title: string; whatsapp: string }) {
  return (
    <section className="cv-auto relative overflow-hidden" aria-labelledby="final-cta-title">
      <div aria-hidden="true" className="placeholder-media vignette absolute inset-0" />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[8vh] bg-ink" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[8vh] bg-ink" />

      <div className="container-cinema relative flex min-h-[80svh] flex-col items-center justify-center py-40 text-center">
        <SectionLabel line={false}>Now Booking · All Over Maharashtra</SectionLabel>
        <RevealText
          as="h2"
          className="mt-8 max-w-5xl font-display text-[48px] leading-[0.95] font-light md:text-[110px] xl:text-[150px]"
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
          <Button href="/contact" variant="outline" size="lg">
            Send Enquiry
          </Button>
        </div>
      </div>
    </section>
  );
}
