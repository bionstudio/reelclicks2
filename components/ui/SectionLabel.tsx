import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  /** Show the red REC dot before the label. */
  line?: boolean;
  as?: "p" | "span" | "h2" | "h3";
};

/** Small mono "camera HUD" label: ● LABEL */
export function SectionLabel({ children, className, line = true, as: Tag = "p" }: Props) {
  return (
    <Tag className={cn("label inline-flex items-center gap-2.5 text-paper/70", className)}>
      {line && <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-red" />}
      {children}
    </Tag>
  );
}
