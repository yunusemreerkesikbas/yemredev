import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Project } from "@/types/project";
import { cn } from "@/lib/utils";

type FeaturedProjectProps = {
  project: Project | null;
  className?: string;
};

const STATUS_DOT_TONE = {
  live: "bg-accent-emerald shadow-[0_0_8px_rgba(16,185,129,0.6)]",
  wip: "bg-accent-amber shadow-[0_0_8px_rgba(251,191,36,0.6)]",
  archived: "bg-foreground/35 dark:bg-white/40",
} as const;

const CATEGORY_TINT = {
  saas: "from-primary/30 via-primary/0 to-accent-purple/20",
  tool: "from-accent-emerald/25 via-accent-emerald/0 to-primary/20",
  "open-source": "from-accent-purple/30 via-accent-purple/0 to-primary/20",
  client: "from-primary/25 via-primary/0 to-accent-amber/15",
} as const;

/**
 * Center bento cell. Browser-chrome mockup + flagship project metadata.
 * Whole tile is a `<Link href="/projects">` so a single primary CTA owns
 * navigation. Mockup interior is a CSS skeleton — no real screenshot
 * required for Phase 3 ship.
 *
 * If `project` is null (empty content), renders an empty-state placeholder
 * so the grid still feels intentional.
 */
export function FeaturedProject({ project, className }: FeaturedProjectProps) {
  const t = useTranslations("home.featured");

  const positionClasses =
    "lg:col-start-2 lg:col-span-2 lg:row-start-1 lg:row-span-4";

  if (!project) {
    return (
      <section
        className={cn(
          "glass-bento-surface relative flex min-h-[280px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border p-6 text-center text-muted-foreground",
          positionClasses,
          className,
        )}
      >
        <span className="font-mono text-xs uppercase tracking-wider">
          {t("eyebrow")}
        </span>
      </section>
    );
  }

  const status = project.status ?? "live";
  const category = project.category ?? "client";
  const statusLabel =
    status === "live"
      ? t("statusLive")
      : status === "wip"
        ? t("statusWip")
        : t("statusArchived");

  return (
    <Link
      href="/projects"
      aria-label={`${t("viewProject")}: ${project.title}`}
      className={cn(
        "glass-bento-surface group relative flex flex-col overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-[0_24px_72px_-28px_rgba(59,184,247,0.48),0_22px_56px_-28px_rgba(0,0,0,0.85)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 sm:p-6",
        positionClasses,
        className,
      )}
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100",
          "bg-gradient-to-br",
          CATEGORY_TINT[category],
        )}
      />

      <header className="relative z-10 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          <span>{t("eyebrow")}</span>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1.5 text-foreground/75">
            <span
              aria-hidden
              className={cn("h-1.5 w-1.5 rounded-full", STATUS_DOT_TONE[status])}
            />
            {statusLabel}
          </span>
        </div>
        <span className="font-mono text-[11px] font-semibold tabular-nums text-foreground/45">
          {project.year}
        </span>
      </header>

      <div className="relative z-10 mt-4 flex-1">
        <BrowserMockup ariaLabel={t("mockupAlt")} />
      </div>

      <div className="relative z-10 mt-5 space-y-2">
        <h3 className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-[28px] sm:leading-[1.15]">
          {project.title}
        </h3>
        <p className="text-pretty line-clamp-2 text-sm font-medium leading-relaxed text-foreground/78 sm:text-base">
          {project.summary}
        </p>
      </div>

      <div className="relative z-10 mt-4 flex flex-wrap items-center justify-between gap-3">
        <ul className="flex list-none flex-wrap gap-1.5 p-0">
          {project.stack.slice(0, 5).map((item) => (
            <li
              key={item}
              className="rounded-full border border-border bg-foreground/[0.07] px-2.5 py-0.5 text-[11px] font-semibold text-foreground/88 dark:border-white/14 dark:bg-white/[0.09] dark:text-white/88"
            >
              {item}
            </li>
          ))}
        </ul>

        <span className="inline-flex items-center gap-1.5 text-sm font-bold tracking-tight text-foreground transition-transform duration-200 group-hover:translate-x-0.5">
          {t("viewProject")}
          <ArrowUpRight
            aria-hidden
            className="h-4 w-4 text-primary"
            strokeWidth={2}
          />
        </span>
      </div>
    </Link>
  );
}

/**
 * Browser-chrome mockup with skeleton placeholders. Decorative — does not
 * represent a real screenshot. Pure server JSX, no animations beyond
 * pulse-slow on the largest skeleton block.
 */
function BrowserMockup({ ariaLabel }: { ariaLabel: string }) {
  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className="relative h-full min-h-[140px] overflow-hidden rounded-xl border border-white/14 bg-gradient-to-br from-zinc-950/90 via-zinc-950/70 to-black/80 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.75),inset_0_1px_0_rgba(255,255,255,0.06)]"
    >
      <div className="flex items-center gap-1.5 border-b border-white/10 bg-white/[0.06] px-3 py-2">
        <span aria-hidden className="h-2 w-2 rounded-full bg-white/25" />
        <span aria-hidden className="h-2 w-2 rounded-full bg-white/25" />
        <span aria-hidden className="h-2 w-2 rounded-full bg-white/25" />
        <div
          aria-hidden
          className="ml-3 hidden h-1.5 w-1/2 rounded-full bg-white/10 sm:block"
        />
      </div>

      <div className="grid h-[calc(100%-30px)] grid-cols-5 gap-2 p-3">
        <div className="col-span-1 space-y-1.5">
          <div aria-hidden className="h-2 rounded-sm bg-white/10" />
          <div aria-hidden className="h-2 rounded-sm bg-white/[0.07]" />
          <div aria-hidden className="h-2 rounded-sm bg-white/10" />
          <div aria-hidden className="h-2 rounded-sm bg-white/[0.07]" />
          <div aria-hidden className="h-2 rounded-sm bg-white/10" />
        </div>
        <div className="col-span-4 grid grid-rows-3 gap-2">
          <div
            aria-hidden
            className="animate-pulse-slow rounded-md bg-gradient-to-r from-primary/22 via-primary/10 to-accent-purple/18"
          />
          <div className="grid grid-cols-2 gap-2">
            <div aria-hidden className="rounded-md bg-white/[0.08]" />
            <div aria-hidden className="rounded-md bg-white/[0.08]" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div aria-hidden className="rounded-md bg-white/[0.07]" />
            <div aria-hidden className="rounded-md bg-white/[0.07]" />
            <div aria-hidden className="rounded-md bg-white/[0.07]" />
          </div>
        </div>
      </div>
    </div>
  );
}
