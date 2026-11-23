import { SectionLabel } from "@/components/ui/SectionLabel";

/**
 * Minimal, stylised Maharashtra map (simplified outline — decorative, not to
 * survey accuracy) with glowing points on the studio's home towns.
 */

// Simplified outline [longitude, latitude].
const OUTLINE: Array<[number, number]> = [
  [72.9, 20.2], [72.8, 19.0], [73.0, 18.0], [73.3, 17.0], [73.7, 16.0], [74.0, 15.7],
  [74.3, 15.95], [74.6, 16.5], [75.2, 16.6], [75.8, 17.0], [76.3, 17.35], [77.0, 17.6],
  [77.5, 18.2], [77.6, 18.6], [78.2, 19.0], [78.9, 19.4], [79.3, 18.9], [80.0, 18.75],
  [80.4, 19.3], [80.5, 20.3], [80.9, 21.0], [80.6, 21.4], [79.9, 21.6], [79.2, 21.55],
  [78.5, 21.6], [77.9, 21.4], [77.3, 21.75], [76.6, 21.5], [76.0, 21.4], [75.4, 21.55],
  [74.8, 21.65], [74.2, 22.05], [73.7, 21.8], [73.5, 21.2], [73.1, 20.75],
];

const HOME = [
  { name: "Nashik", lon: 73.79, lat: 19.99, dx: -14, dy: 22, anchor: "end" },
  { name: "Manmad", lon: 74.44, lat: 20.25, dx: -12, dy: -14, anchor: "end" },
  { name: "Nandgaon", lon: 74.66, lat: 20.31, dx: 14, dy: 22, anchor: "start" },
  { name: "Malegaon", lon: 74.53, lat: 20.55, dx: 10, dy: -14, anchor: "start" },
] as const;

const OTHER = [
  { name: "Mumbai", lon: 72.88, lat: 19.07 },
  { name: "Pune", lon: 73.86, lat: 18.52 },
  { name: "Aurangabad", lon: 75.34, lat: 19.88 },
  { name: "Nagpur", lon: 79.09, lat: 21.15 },
  { name: "Kolhapur", lon: 74.24, lat: 16.7 },
  { name: "Nanded", lon: 77.32, lat: 19.15 },
  { name: "Amravati", lon: 77.75, lat: 20.93 },
];

const K = 70;
const x = (lon: number) => (lon - 72.4) * K;
const y = (lat: number) => (22.4 - lat) * K;
const W = x(81.3);
const H = y(15.4);
const path = OUTLINE.map(([lon, lat], i) => `${i ? "L" : "M"}${x(lon).toFixed(1)} ${y(lat).toFixed(1)}`).join(" ") + " Z";

export function ServiceAreas({ locations, serviceArea }: { locations: string[]; serviceArea: string }) {
  return (
    <section className="cv-auto border-t border-hairline py-28 md:py-40" aria-labelledby="areas-title">
      <div className="container-cinema grid items-center gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionLabel>Service Areas</SectionLabel>
          <h2 id="areas-title" className="mt-6 font-display text-[44px] leading-[0.95] font-light md:text-7xl">
            Rooted in North Maharashtra. <em className="text-gold-soft">Filming everywhere.</em>
          </h2>
          <p className="mt-8 max-w-md text-muted">
            Based in {locations.join(", ").replace(/, ([^,]*)$/, " and $1")} — {serviceArea.toLowerCase()}.
          </p>
          <ul className="mt-8 flex flex-wrap gap-3">
            {locations.map((l) => (
              <li key={l} className="label rounded-full border border-gold/40 px-4 py-2.5 text-ivory">
                {l}
              </li>
            ))}
            <li className="label rounded-full bg-gold px-4 py-2.5 text-ink">{serviceArea}</li>
          </ul>
        </div>

        <div className="lg:col-span-7">
          <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`Map of Maharashtra highlighting ${locations.join(", ")}`}>
            <defs>
              <radialGradient id="map-glow" cx="30%" cy="35%" r="60%">
                <stop offset="0%" stopColor="#C9A96E" stopOpacity="0.14" />
                <stop offset="100%" stopColor="#C9A96E" stopOpacity="0" />
              </radialGradient>
              <filter id="dot-glow" x="-200%" y="-200%" width="500%" height="500%">
                <feGaussianBlur stdDeviation="4" />
              </filter>
            </defs>
            <path d={path} fill="url(#map-glow)" stroke="#C9A96E" strokeOpacity="0.45" strokeWidth="1" strokeLinejoin="round" />
            <path d={path} fill="none" stroke="#C9A96E" strokeOpacity="0.12" strokeWidth="10" strokeLinejoin="round" />

            {OTHER.map((c) => (
              <g key={c.name}>
                <circle cx={x(c.lon)} cy={y(c.lat)} r="2.2" fill="#8A857C" />
                <text x={x(c.lon) + 8} y={y(c.lat) + 4} fill="#8A857C" fontSize="11" letterSpacing="2" className="font-sans uppercase">
                  {c.name}
                </text>
              </g>
            ))}

            {HOME.map((c, i) => (
              <g key={c.name}>
                <circle cx={x(c.lon)} cy={y(c.lat)} r="9" fill="#E6D3A3" opacity="0.6" filter="url(#dot-glow)" />
                <circle
                  cx={x(c.lon)}
                  cy={y(c.lat)}
                  r="4"
                  fill="none"
                  stroke="#C9A96E"
                  className="map-pulse"
                  style={{ animationDelay: `${i * 0.6}s` }}
                />
                <circle cx={x(c.lon)} cy={y(c.lat)} r="3.5" fill="#C9A96E" />
                <text
                  x={x(c.lon) + c.dx}
                  y={y(c.lat) + c.dy}
                  textAnchor={c.anchor}
                  fill="#F3EEE6"
                  fontSize="13"
                  letterSpacing="2.5"
                  className="font-sans uppercase"
                >
                  {c.name}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </section>
  );
}
