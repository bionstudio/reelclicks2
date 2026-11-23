import type { TeamMember } from "@/lib/sanity/types";
import { CoverMedia } from "@/components/ui/CoverMedia";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { RevealMedia } from "@/components/ui/RevealMedia";

type Role = { role: string; text: string };

/**
 * Crew from Sanity (non-leader team members). Until crew are added, shows the
 * crew roles instead — no placeholder names.
 */
export function CrewGrid({ crew, roles }: { crew: TeamMember[]; roles: Role[] }) {
  return (
    <section className="border-t border-hairline py-28 md:py-40" aria-labelledby="crew-title">
      <div className="container-cinema">
        <SectionLabel>The Crew</SectionLabel>
        <h2 id="crew-title" className="mt-6 max-w-4xl font-display text-[44px] leading-[0.95] font-light md:text-7xl">
          A small crew <em className="text-gold-soft">with a big heart.</em>
        </h2>

        {crew.length > 0 ? (
          <ul className="mt-16 grid grid-cols-2 gap-x-5 gap-y-12 md:mt-24 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8">
            {crew.map((m, i) => (
              <li key={m._id} className="group">
                <RevealMedia className="aspect-3/4 bg-charcoal" delay={(i % 4) * 0.08}>
                  <div className="relative h-full w-full grayscale transition-[filter] duration-1000 group-hover:grayscale-0">
                    <CoverMedia image={m.photo} alt={`${m.name}, ${m.role}`} variant={i} sizes="(min-width: 1024px) 25vw, 50vw" />
                  </div>
                </RevealMedia>
                <h3 className="mt-5 font-display text-2xl font-light text-ivory md:text-3xl">{m.name}</h3>
                <p className="label mt-2 text-gold">{m.role}</p>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="mt-16 grid border-t border-hairline sm:grid-cols-2 md:mt-24 lg:grid-cols-4">
            {roles.map((r, i) => (
              <li
                key={r.role}
                className="border-b border-hairline py-10 sm:px-8 sm:odd:border-r sm:odd:pl-0 lg:border-r lg:first:pl-0 lg:last:border-r-0"
              >
                <span className="label text-gold">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-6 font-display text-3xl font-light text-ivory">{r.role}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{r.text}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
