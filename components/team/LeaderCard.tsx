import type { TeamMember } from "@/lib/sanity/types";
import { telLink, whatsappLink } from "@/lib/utils";
import { CoverMedia } from "@/components/ui/CoverMedia";
import { Button } from "@/components/ui/Button";
import { PhoneIcon, WhatsAppIcon } from "@/components/ui/Icons";

/** Portrait (grayscale → colour on hover), role, bio and Call / WhatsApp buttons. */
export function LeaderCard({ member, index = 0 }: { member: TeamMember; index?: number }) {
  return (
    <article className="group">
      <div className="relative aspect-4/5 overflow-hidden bg-charcoal">
        <div className="absolute inset-0 grayscale transition-[filter,transform] duration-[1.4s] ease-expo-out group-hover:scale-[1.03] group-hover:grayscale-0">
          <CoverMedia
            image={member.photo}
            alt={`Portrait of ${member.name}, ${member.role} of REELCLICKS.IN`}
            variant={index + 3}
            sizes="(min-width: 768px) 45vw, 100vw"
          />
        </div>
        {!member.photo && (
          <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center font-display text-[120px] font-light text-ivory/10">
            {member.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </span>
        )}
        <span aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-ink/80 via-transparent to-transparent" />
        <p className="label absolute bottom-5 left-5 text-gold">{member.role}</p>
      </div>

      <h3 className="mt-8 font-display text-4xl font-light text-ivory md:text-5xl">{member.name}</h3>
      {member.quote && <p className="mt-3 font-display text-xl text-gold-soft italic">“{member.quote}”</p>}
      {member.bio && <p className="mt-5 max-w-lg leading-relaxed text-muted">{member.bio}</p>}

      <div className="mt-8 flex flex-wrap gap-3">
        {member.phone && (
          <Button href={telLink(member.phone)} variant="outline" size="sm" data-track="call_click">
            <PhoneIcon className="h-4 w-4" />
            Call {member.name.split(" ")[0]}
          </Button>
        )}
        {member.whatsapp && (
          <Button href={whatsappLink(member.whatsapp)} newTab size="sm" data-track="whatsapp_click">
            <WhatsAppIcon className="h-4 w-4" />
            WhatsApp
          </Button>
        )}
      </div>
    </article>
  );
}
