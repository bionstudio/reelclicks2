/** Red ticker strip — the services, looping. Decorative duplicate is hidden from screen readers. */
export function Ticker({ items }: { items: string[] }) {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((t) => (
        <li key={t} className="flex items-center">
          <span className="px-6 font-display text-3xl font-semibold whitespace-nowrap md:px-10 md:text-5xl">{t}</span>
          <span aria-hidden="true" className="h-3 w-3 rounded-full bg-black md:h-4 md:w-4" />
        </li>
      ))}
    </ul>
  );

  return (
    <section className="theme-red overflow-hidden py-5 md:py-7" aria-label="What we make">
      <div className="marquee flex w-max">
        <div className="ticker-track flex">
          {row(false)}
          {row(true)}
        </div>
      </div>
    </section>
  );
}
