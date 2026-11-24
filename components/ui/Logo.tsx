import { cn } from "@/lib/utils";

/** Text wordmark with a blinking REC dot — replaced by the client's SVG logo when supplied. */
export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-display text-xl leading-none font-bold tracking-[-0.04em] text-paper",
        className,
      )}
    >
      <span aria-hidden="true" className="h-[0.45em] w-[0.45em] shrink-0 animate-rec rounded-full bg-red" />
      <span>
        reelclicks<span className="text-red">.in</span>
      </span>
    </span>
  );
}
