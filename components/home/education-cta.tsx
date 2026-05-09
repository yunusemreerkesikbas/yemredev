import { useTranslations } from "next-intl";
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
 * Bottom-right bento cell. Compact education entries above a primary
 * "Get in Touch" CTA — single conversion target on the home dashboard.
 */
export function EducationCTA({ education, className }: EducationCTAProps) {
  const tEdu = useTranslations("home.education");
  const tCta = useTranslations("home.cta");

  return (
    <BentoCard
      className={cn(
        "lg:col-start-4 lg:col-span-1 lg:row-start-5 lg:row-span-2",
        className,
      )}
    >
      <header className="flex items-center gap-2">
        <GraduationCap
          aria-hidden
          className="h-4 w-4 text-primary/85"
          strokeWidth={1.75}
        />
        <h2 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-white/70">
          {tEdu("title")}
        </h2>
      </header>

      <ul className="mt-3 flex-1 list-none space-y-3 p-0">
        {education.map((entry) => (
          <li key={`${entry.school}-${entry.start}`}>
            <p className="text-sm font-semibold leading-tight text-white">
              {entry.degree}{entry.field ? `, ${entry.field}` : null}
            </p>
            <p className="text-xs font-medium text-white/72">{entry.school}</p>
            <p className="mt-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-white/50">
              <time dateTime={entry.start}>{entry.start}</time>
              <span aria-hidden> — </span>
              <time dateTime={entry.end}>{entry.end}</time>
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-4 border-t border-white/10 pt-4">
        <p className="text-xs font-medium text-white/70">{tCta("subtitle")}</p>
        <Link
          href="/contact"
          className="group/cta mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-black shadow-[0_6px_28px_-6px_rgba(255,255,255,0.35),0_2px_0_rgba(0,0,0,0.06)_inset] transition-all duration-200 hover:-translate-y-px hover:bg-gray-100 hover:shadow-[0_10px_36px_-8px_rgba(59,184,247,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
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
