import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BentoGridProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Phase 3 home bento wrapper. Pure layout — each child card carries its
 * own `lg:col-start-*` / `lg:row-start-*` / `lg:col-span-*` / `lg:row-span-*`
 * position classes so the JSX order can stay mobile-natural while desktop
 * placement is explicit (no reliance on grid-auto-flow ordering).
 *
 * Layout (4 cols × 6 rows on `lg` and up):
 *
 *   col 1                 col 2-3              col 4
 *   ┌──────────────┐  ┌──────────────────┐  ┌──────────────┐
 *   │  STATUS  1×3 │  │                  │  │              │
 *   │              │  │  FEATURED   2×4  │  │  EXPERIENCE  │
 *   ├──────────────┤  │                  │  │     1×4      │
 *   │  TECH        │  │                  │  │              │
 *   │  STACK  1×3  │  │                  │  │              │
 *   │              │  ├──────────────────┤  ├──────────────┤
 *   │              │  │                  │  │              │
 *   │              │  │   OSS       2×2  │  │  EDUCATION   │
 *   │              │  │                  │  │     CTA  1×2 │
 *   └──────────────┘  └──────────────────┘  └──────────────┘
 *
 * Below `lg` the grid collapses to a single column and the page
 * regains its natural vertical scroll (DESIGN.md §7.2 mobile rule).
 */
export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid h-full w-full grid-cols-1 gap-4 lg:grid-cols-4 lg:grid-rows-6",
        className,
      )}
    >
      {children}
    </div>
  );
}
