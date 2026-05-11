import { useTranslations } from "next-intl";
import { ArrowUpRight, GitFork, Star } from "lucide-react";
import type { OpenSourceProject } from "@/types/open-source";
import { BentoCard } from "./bento-card";
import { cn } from "@/lib/utils";

type OpenSourceHighlightProps = {
  /** Either a single OSS entry to spotlight or null/empty for empty-state. */
  project: OpenSourceProject | null;
  className?: string;
};

const ORB_TINT = {
  primary: "bg-primary/22",
  emerald: "bg-accent-emerald/22",
  purple: "bg-accent-purple/22",
  amber: "bg-accent-amber/22",
} as const;

/**
 * Bottom-center bento cell. Spotlights one open-source contribution.
 * Shows name + description + stars/forks/language + repo link. Decorative
 * blur orbs in the corners pick up the project's `primaryColor` token.
 */
export function OpenSourceHighlight({
  project,
  className,
}: OpenSourceHighlightProps) {
  const t = useTranslations("home.openSource");

  const positionClasses =
    "lg:col-start-2 lg:col-span-2 lg:row-start-5 lg:row-span-2";

  if (!project) {
    return (
      <BentoCard
        className={cn(
          "items-center justify-center text-center text-muted-foreground",
          positionClasses,
          className,
        )}
      >
        <span className="font-mono text-xs uppercase tracking-wider">
          {t("eyebrow")}
        </span>
        <p className="mt-2 text-sm font-medium text-foreground/70">{t("emptyState")}</p>
      </BentoCard>
    );
  }

  const orbTint = project.primaryColor
    ? ORB_TINT[project.primaryColor]
    : ORB_TINT.primary;

  return (
    <BentoCard className={cn(positionClasses, className)}>
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full blur-2xl",
          orbTint,
        )}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-16 -left-12 h-44 w-44 rounded-full bg-accent-emerald/16 blur-2xl"
      />

      <div className="relative z-10 flex flex-col gap-3 max-lg:h-auto lg:h-full">
        <header className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {t("eyebrow")}
            </p>
            <h2 className="mt-1 truncate text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {project.name}
            </h2>
          </div>
          <span className="shrink-0 rounded-md border border-border bg-foreground/[0.06] px-2 py-1 font-mono text-[10px] font-semibold text-foreground/80 dark:border-white/14 dark:bg-white/[0.08] dark:text-white/80">
            {project.language}
          </span>
        </header>

        <p className="text-pretty text-sm font-medium leading-relaxed text-foreground/78 lg:line-clamp-3">
          {project.description}
        </p>

        <footer className="font-tabular mt-auto flex flex-wrap items-center gap-4 pt-2 text-xs font-medium text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Star
              aria-hidden
              className="h-3.5 w-3.5 text-accent-amber"
              strokeWidth={1.75}
            />
            <span aria-label={t("starsLabel")}>
              {project.stars.toLocaleString()}
            </span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <GitFork
              aria-hidden
              className="h-3.5 w-3.5 text-muted-foreground"
              strokeWidth={1.75}
            />
            <span aria-label={t("forksLabel")}>
              {project.forks.toLocaleString()}
            </span>
          </span>

          <a
            href={project.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-border bg-foreground/[0.06] px-3 py-1.5 text-xs font-semibold text-foreground/90 transition-all duration-200 hover:-translate-y-px hover:border-primary/45 hover:bg-foreground/[0.1] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 dark:border-white/14 dark:bg-white/[0.08] dark:text-white/90 dark:hover:bg-white/[0.14] dark:hover:text-white"
          >
            {t("viewRepo")}
            <ArrowUpRight
              aria-hidden
              className="h-3.5 w-3.5"
              strokeWidth={2}
            />
          </a>
        </footer>
      </div>
    </BentoCard>
  );
}
