import type { TeamMember } from "@/lib/sanity/types";
import { cn, telLink, whatsappLink } from "@/lib/utils";
import { CoverMedia } from "@/components/ui/CoverMedia";
import { RevealMedia } from "@/components/ui/RevealMedia";
import { RevealText } from "@/components/ui/RevealText";
import { Button } from "@/components/ui/Button";
import { InstagramIcon, PhoneIcon, WhatsAppIcon } from "@/components/ui/Icons";

/** Large editorial spread for one leader: parallax portrait + role, bio, quote, contact buttons. */
export function LeaderSpotlight({ member, index }: { member: TeamMember; index: number }) {
  const flip = index % 2 === 1;
  const first = member.name.split(" ")[0];

  return (
    <article
      aria-labelledby={`leader-${member._id}`}
      className="grid items-center gap-12 border-t border-hairline py-20 md:py-32 lg:grid-cols-12 lg:gap-16"
    >
      <div className={cn("lg:col-span-6", flip && "lg:order-2 lg:col-start-7")}>
        <RevealMedia className="aspect-4/5 bg-surface" parallax from={flip ? "right" : "left"}>
          <div className="relative h-full w-full">
            <CoverMedia
              image={member.photo}
              alt={`Portrait of ${member.name}, ${member.role} of REELCLICKS.IN`}
              variant={index + 3}
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
            {!member.photo && (
              <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center font-display text-[160px] text-paper/10">
                {member.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            )}
          </div>
        </RevealMedia>
      </div>

      <div className={cn("lg:col-span-5", flip ? "lg:order-1 lg:col-start-1" : "lg:col-start-8")}>
        <p className="label flex items-center gap-4 text-red">
          <span aria-hidden="true" className="h-px w-10 bg-red" />
          {member.role}
        </p>
        <RevealText as="h2" className="mt-6 font-display text-[48px] leading-[0.92] text-paper md:text-8xl">
          <span id={`leader-${member._id}`}>{member.name}</span>
        </RevealText>
        {member.quote && (
          <blockquote className="mt-8 border-l border-red/50 pl-6 font-display text-2xl leading-snug text-red italic md:text-3xl">
            “{member.quote}”
          </blockquote>
        )}
        {member.bio && <p className="mt-8 max-w-lg leading-relaxed text-paper/75">{member.bio}</p>}

        <div className="mt-10 flex flex-wrap gap-3">
          {member.phone && (
            <Button href={telLink(member.phone)} variant="outline" size="sm" data-track="call_click">
              <PhoneIcon className="h-4 w-4" />
              Call {first}
            </Button>
          )}
          {member.whatsapp && (
            <Button href={whatsappLink(member.whatsapp)} newTab size="sm" data-track="whatsapp_click">
              <WhatsAppIcon className="h-4 w-4" />
              WhatsApp {first}
            </Button>
          )}
          {member.instagram && (
            <Button href={member.instagram} newTab variant="ghost" size="sm" aria-label={`${member.name} on Instagram`}>
              <InstagramIcon className="h-4 w-4" />
              Instagram
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
