import Image from "next/image";
import { getTranslations } from "next-intl/server";
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
  cms: "from-accent-amber/22 via-accent-amber/0 to-primary/18",
} as const;

/**
 * Center bento cell. Banner preview image + flagship project metadata.
 * Whole tile is a `<Link href="/projects">` so a single primary CTA owns
 * navigation.
 *
 * If `project` is null (empty content), renders an empty-state placeholder
 * so the grid still feels intentional.
 */
export async function FeaturedProject({
  project,
  className,
}: FeaturedProjectProps) {
  const t = await getTranslations("home.featured");

  const positionClasses =
    "lg:col-start-2 lg:col-span-2 lg:row-start-1 lg:row-span-6";

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

      <div className="relative z-10 mt-4 w-full max-lg:flex-none lg:min-h-0 lg:flex-1">
        <div className="relative h-[200px] w-full overflow-hidden rounded-xl border border-white/14 bg-[#efece6] shadow-[0_12px_40px_-12px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)] sm:h-[240px] md:h-[260px] lg:h-full lg:min-h-[280px]">
          <Image
            src="/craftive.png"
            alt={project.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 960px"
            className="object-contain object-center motion-safe:transition-transform motion-safe:duration-500 group-hover:scale-[1.02]"
            priority
          />
        </div>
      </div>

      <div className="relative z-10 mt-5 space-y-2">
        <h3 className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-[28px] sm:leading-[1.15]">
          {project.title}
        </h3>
        <p className="text-pretty text-sm font-medium leading-relaxed text-foreground/78 sm:text-base lg:line-clamp-2">
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
