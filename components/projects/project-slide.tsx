import { getTranslations } from "next-intl/server";
import {
  ArrowUpRight,
  BookOpen,
  ExternalLink,
  Play,
} from "lucide-react";
import { GithubIcon } from "@/components/icons/brand-icons";
import type { Project, ProjectCategory, ProjectLink } from "@/types/project";
import { cn } from "@/lib/utils";
import {
  ProjectMediaCarousel,
  type MediaSlide,
} from "@/components/projects/project-media-carousel";

type ProjectSlideProps = {
  project: Project;
};

const STATUS_DOT = {
  live: "bg-accent-emerald shadow-[0_0_8px_rgba(16,185,129,0.55)]",
  wip: "bg-accent-amber shadow-[0_0_8px_rgba(251,191,36,0.55)]",
  archived: "bg-foreground/35 dark:bg-white/45",
} as const;

const CATEGORY_BG: Record<ProjectCategory, string> = {
  saas: "from-primary/20 via-transparent to-accent-purple/15",
  tool: "from-accent-emerald/18 via-transparent to-primary/12",
  "open-source": "from-accent-purple/20 via-transparent to-primary/12",
  client: "from-primary/15 via-transparent to-accent-amber/12",
};

function linkIcon(type: ProjectLink["type"]) {
  switch (type) {
    case "live":
      return ExternalLink;
    case "repo":
      return GithubIcon;
    case "case-study":
      return BookOpen;
    case "demo":
      return Play;
    default:
      return ArrowUpRight;
  }
}

function buildMediaSlides(
  project: Project,
  t: (key: string, values?: Record<string, string | number>) => string,
): MediaSlide[] {
  const paths: string[] = [];
  if (project.cover?.startsWith("/")) paths.push(project.cover);
  for (const g of project.gallery ?? []) {
    if (typeof g === "string" && g.startsWith("/") && !paths.includes(g)) {
      paths.push(g);
    }
  }
  return paths.map((src, index) => ({
    src,
    alt:
      index === 0
        ? t("coverAlt", { title: project.title })
        : t("galleryAlt", { title: project.title, slide: index + 1 }),
  }));
}

/**
 * One carousel slide — Server Component. Copy and layout mirror the home
 * featured card language (status, stack chips) while expanding body text
 * for the detail view.
 */
export async function ProjectSlide({ project }: ProjectSlideProps) {
  const t = await getTranslations("projects.slide");
  const status = project.status ?? "live";
  const category = project.category ?? "client";

  const statusLabel =
    status === "live"
      ? t("statusLive")
      : status === "wip"
        ? t("statusWip")
        : t("statusArchived");

  const categoryLabel = t(`category.${category}`);
  const mediaSlides = buildMediaSlides(project, t);
  const detailText = project.detail?.trim();

  return (
    <article
      aria-labelledby={`project-title-${project.slug}`}
      className="glass-bento-surface relative flex h-full min-h-0 flex-col overflow-hidden rounded-2xl p-6 transition-[border-color] duration-300 ease-out hover:border-primary/55 motion-reduce:transition-none md:p-8"
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 opacity-40",
          "bg-gradient-to-br",
          CATEGORY_BG[category],
        )}
      />

      <header className="relative z-10 flex shrink-0 flex-wrap items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-foreground/[0.06] px-2 py-0.5 text-foreground/75 dark:border-white/12 dark:bg-white/[0.06] dark:text-white/75">
            <span
              aria-hidden
              className={cn("h-1.5 w-1.5 rounded-full", STATUS_DOT[status])}
            />
            {statusLabel}
          </span>
          <span className="rounded-full border border-border bg-foreground/[0.05] px-2 py-0.5 text-foreground/70 dark:border-white/10 dark:bg-white/[0.05] dark:text-white/70">
            {categoryLabel}
          </span>
        </div>
        <span className="font-mono text-[11px] font-semibold tabular-nums text-foreground/45">
          {project.year}
        </span>
      </header>

      <div className="relative z-10 mt-5 grid min-h-0 flex-1 grid-cols-1 gap-6 overflow-hidden lg:grid-cols-[minmax(0,1.14fr)_minmax(0,0.86fr)] lg:gap-8">
        <div className="min-h-0">
          <ProjectMediaCarousel
            slides={mediaSlides}
            previewLabel={t("previewPlaceholder")}
          />
        </div>

        <div className="flex min-h-0 flex-col gap-4 overflow-y-auto overscroll-y-contain pr-0.5 lg:pr-1">
          <h2
            id={`project-title-${project.slug}`}
            className="text-balance text-2xl font-bold tracking-tight text-foreground md:text-3xl md:leading-tight"
          >
            {project.title}
          </h2>
          <p className="text-pretty text-base font-semibold leading-relaxed text-foreground/85">
            {project.summary}
          </p>
          <p className="text-pretty text-sm font-medium leading-relaxed text-foreground/75 md:text-base">
            {project.description}
          </p>

          {detailText ? (
            <section
              className="border-t border-border pt-3 dark:border-white/10"
              aria-labelledby={`project-detail-${project.slug}`}
            >
              <h3
                id={`project-detail-${project.slug}`}
                className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-primary/90"
              >
                {t("detailTitle")}
              </h3>
              <p className="mt-2 max-h-[min(22vh,11rem)] overflow-y-auto overscroll-y-contain text-pretty text-sm font-medium leading-relaxed text-foreground/75">
                {detailText}
              </p>
            </section>
          ) : null}

          <dl className="grid gap-2 text-sm">
            <div className="flex flex-wrap gap-x-2">
              <dt className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {t("roleLabel")}
              </dt>
              <dd className="font-medium text-foreground/85">{project.role}</dd>
            </div>
            {project.client ? (
              <div className="flex flex-wrap gap-x-2">
                <dt className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("clientLabel")}
                </dt>
                <dd className="font-medium text-foreground/80">{project.client}</dd>
              </div>
            ) : null}
          </dl>

          <div>
            <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-primary/90">
              {t("stackTitle")}
            </h3>
            <ul className="mt-2 flex list-none flex-wrap gap-1.5 p-0">
              {project.stack.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-border bg-foreground/[0.07] px-2.5 py-0.5 text-[11px] font-semibold text-foreground/88 transition-[border-color,background-color,transform] duration-200 ease-out hover:border-primary/40 hover:bg-foreground/[0.11] hover:text-foreground motion-reduce:hover:scale-100 sm:hover:scale-[1.03] dark:border-white/14 dark:bg-white/[0.08] dark:text-white/88 dark:hover:bg-white/[0.12] dark:hover:text-white"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {project.links.length > 0 ? (
            <div>
              <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                {t("linksTitle")}
              </h3>
              <ul className="mt-2 flex list-none flex-wrap gap-2 p-0">
                {project.links.map((link) => {
                  const Icon = linkIcon(link.type);
                  return (
                    <li key={`${link.type}-${link.url}`}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/link inline-flex items-center gap-1.5 rounded-lg border border-border bg-foreground/[0.06] px-3 py-2 text-xs font-semibold text-foreground/90 transition-[transform,border-color,background-color] duration-200 ease-out hover:-translate-y-0.5 hover:border-primary/50 hover:bg-foreground/[0.1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 motion-reduce:hover:translate-y-0 dark:border-white/14 dark:bg-white/[0.07] dark:text-white/90 dark:hover:bg-white/[0.12]"
                      >
                        <Icon aria-hidden className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover/link:scale-110 motion-reduce:group-hover/link:scale-100" />
                        {link.label}
                        <ArrowUpRight
                          aria-hidden
                          className="h-3 w-3 translate-x-0 translate-y-0 text-primary/90 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 motion-reduce:group-hover/link:translate-x-0 motion-reduce:group-hover/link:translate-y-0"
                          strokeWidth={2}
                        />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
