import { getTranslations } from "next-intl/server";
import { ArrowRight, GraduationCap } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Education } from "@/types/profile";
import { BentoCard } from "./bento-card";
import { cn } from "@/lib/utils";

type EducationCTAProps = {
  education: Education[];
  className?: string;
};

/**
 * Bottom-right bento cell. Education list scrolls when needed; primary CTA stays
 * pinned at the bottom of the card.
 */
export async function EducationCTA({ education, className }: EducationCTAProps) {
  const tEdu = await getTranslations("home.education");
  const tCta = await getTranslations("home.cta");

  return (
    <BentoCard
      className={cn(
        "min-h-0 lg:min-h-0 lg:col-start-4 lg:col-span-1 lg:row-start-5 lg:row-span-2",
        className,
      )}
    >
      <header className="flex shrink-0 items-center gap-2 border-b border-border pb-3 dark:border-white/10">
        <GraduationCap
          aria-hidden
          className="h-4 w-4 text-primary/85"
          strokeWidth={1.75}
        />
        <h2 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {tEdu("title")}
        </h2>
      </header>

      <ul className="thin-scrollbar list-none space-y-3 py-3 p-0 max-lg:flex-none max-lg:overflow-visible lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
        {education.map((entry) => (
          <li key={`${entry.school}-${entry.start}`}>
            <p className="text-sm font-semibold leading-tight text-foreground">
              {entry.degree}{entry.field ? `, ${entry.field}` : null}
            </p>
            <p className="text-xs font-medium text-foreground/72">{entry.school}</p>
            <p className="mt-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              <time dateTime={entry.start}>{entry.start}</time>
              <span aria-hidden> — </span>
              <time dateTime={entry.end}>{entry.end}</time>
            </p>
          </li>
        ))}
      </ul>

      <div className="shrink-0 border-t border-border pt-4 dark:border-white/10">
        <Link
          href="/contact"
          className="group/cta mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-bold text-background shadow-[0_6px_28px_-6px_rgba(0,0,0,0.18)] transition-all duration-200 hover:-translate-y-px hover:bg-foreground/90 hover:shadow-[0_10px_36px_-8px_rgba(59,184,247,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 dark:bg-white dark:text-black dark:shadow-[0_6px_28px_-6px_rgba(255,255,255,0.35),0_2px_0_rgba(0,0,0,0.06)_inset] dark:hover:bg-gray-100"
        >
          {tCta("button")}
          <ArrowRight
            aria-hidden
            className="h-4 w-4 transition-transform duration-200 group-hover/cta:translate-x-0.5"
            strokeWidth={2}
          />
        </Link>
      </div>
    </BentoCard>
  );
}
