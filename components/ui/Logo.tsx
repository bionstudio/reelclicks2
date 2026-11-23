import { cn } from "@/lib/utils";

/** Text wordmark — replaced by the client's SVG logo (from Sanity) when supplied. */
export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-display text-xl leading-none font-medium tracking-[0.18em] text-ivory",
        className,
      )}
    >
      REELCLICKS<span className="text-gold">.IN</span>
    </span>
  );
}
