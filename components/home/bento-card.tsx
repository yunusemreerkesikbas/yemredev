import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BentoCardProps = {
  className?: string;
  children: ReactNode;
  /** Tag for the card root. Defaults to `<section>`. */
  as?: "section" | "article" | "aside";
  /**
   * When the card root is itself an interactive `<Link>` we need the link
   * classes to be applied separately. Use `interactive` to swap to the
   * subtle hover-lift treatment used by the FeaturedProject card.
   */
  interactive?: boolean;
};

/**
 * Shared shell for every Phase 3 bento card. Glass surface + hairline
 * border + rounded-2xl. Hover lift + primary border tint when `interactive`.
 *
 * Cards pass their own `lg:col-start-*` / `lg:row-start-*` etc. via
 * `className` to land in the right cell. Padding is consistent across
 * cards — internal sub-sections override only when they need to.
 */
export function BentoCard({
  className,
  children,
  as: Tag = "section",
  interactive = false,
}: BentoCardProps) {
  return (
    <Tag
      className={cn(
        "glass-bento-surface relative flex flex-col overflow-hidden rounded-2xl p-5",
        interactive &&
          "transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-[0_20px_64px_-24px_rgba(59,184,247,0.42),0_22px_56px_-28px_rgba(0,0,0,0.85)]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
