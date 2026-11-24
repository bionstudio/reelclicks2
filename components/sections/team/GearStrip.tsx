/** Slow marquee of the studio's kit (Sanity → Pages → Team → Our gear). */
export function GearStrip({ gear }: { gear: string[] }) {
  if (!gear.length) return null;

  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {gear.map((g) => (
        <li key={`${hidden ? "b" : "a"}-${g}`} className="flex shrink-0 items-center">
          <span className="px-8 font-display text-4xl whitespace-nowrap text-paper/85 italic md:px-12 md:text-6xl">
            {g}
          </span>
          <span aria-hidden="true" className="h-2 w-2 rotate-45 border border-red" />
        </li>
      ))}
    </ul>
  );

  return (
    <section className="overflow-hidden border-y border-hairline py-14 md:py-20" aria-label="Our gear">
      <p className="label container-cinema mb-10 text-red">The Kit</p>
      <div className="marquee flex w-max">
        <div className="marquee-track flex [animation-duration:45s]">
          {row(false)}
          {row(true)}
        </div>
      </div>
    </section>
  );
}
