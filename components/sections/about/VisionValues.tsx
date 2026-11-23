import type { ReactNode } from "react";
import { SectionLabel } from "@/components/ui/SectionLabel";

const icons: ReactNode[] = [
  // Emotion First — heart
  <path key="0" d="M24 40s-14-8.5-14-19a8 8 0 0 1 14-5.3A8 8 0 0 1 38 21c0 10.5-14 19-14 19Z" />,
  // Cinematic Craft — aperture
  <g key="1">
    <circle cx="24" cy="24" r="15" />
    <path d="M24 9l7 13M39 24l-14 1M31.5 37l-8-12M16.5 37l7.5-12M9 24h15M16.5 11l7.5 13" />
  </g>,
  // On-Time Delivery — clock
  <g key="2">
    <circle cx="24" cy="24" r="15" />
    <path d="M24 15v9l6 4" />
  </g>,
  // Client Trust — shield with check
  <g key="3">
    <path d="M24 8l13 5v10c0 9-5.5 15-13 17-7.5-2-13-8-13-17V13l13-5Z" />
    <path d="M18 24l4.5 4.5L31 20" />
  </g>,
];

type Props = {
  vision: string;
  mission: string;
  values: Array<{ title: string; text: string }>;
};

/** Vision & Mission cards (gold hairlines) + the four values with line icons. */
export function VisionValues({ vision, mission, values }: Props) {
  return (
    <section className="border-t border-hairline py-28 md:py-40" aria-label="Vision, mission and values">
      <div className="container-cinema">
        <div className="grid gap-6 md:grid-cols-2">
          {[
            { label: "Our Vision", text: vision },
            { label: "Our Mission", text: mission },
          ].map((c) => (
            <article key={c.label} className="relative border border-gold/30 p-8 md:p-14">
              <span aria-hidden="true" className="absolute top-0 left-0 h-6 w-6 border-t border-l border-gold" />
              <span aria-hidden="true" className="absolute right-0 bottom-0 h-6 w-6 border-r border-b border-gold" />
              <SectionLabel as="h2">{c.label}</SectionLabel>
              <p className="mt-8 font-display text-3xl leading-[1.15] font-light text-ivory md:text-[42px]">{c.text}</p>
            </article>
          ))}
        </div>

        <div className="mt-28 md:mt-40">
          <SectionLabel>What We Stand For</SectionLabel>
          <ul className="mt-12 grid border-t border-hairline sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <li
                key={v.title}
                className="border-b border-hairline py-10 sm:px-8 sm:odd:border-r sm:odd:pl-0 lg:border-r lg:first:pl-0 lg:last:border-r-0"
              >
                <svg
                  viewBox="0 0 48 48"
                  className="h-12 w-12 text-gold"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {icons[i % icons.length]}
                </svg>
                <h3 className="mt-8 font-display text-3xl font-light text-ivory">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{v.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
