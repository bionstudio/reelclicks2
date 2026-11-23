import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  /** Show the short gold hairline before the label. */
  line?: boolean;
  as?: "p" | "span" | "h2" | "h3";
};

export function SectionLabel({ children, className, line = true, as: Tag = "p" }: Props) {
  return (
    <Tag className={cn("label inline-flex items-center gap-4 text-gold", className)}>
      {line && <span aria-hidden="true" className="h-px w-10 bg-gold/70" />}
      {children}
    </Tag>
  );
}
