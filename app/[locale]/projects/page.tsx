import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ProjectSlide } from "@/components/projects/project-slide";
import { ProjectsCarousel } from "@/components/projects/projects-carousel";
import { JsonLd } from "@/components/seo/json-ld";
import { getProjects } from "@/lib/data";
import {
  buildBreadcrumbSchema,
  buildProjectSchema,
  canonicalUrl,
  hreflangAlternates,
  OG_IMAGE_URL,
} from "@/lib/seo";
import { isAppLocale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isAppLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: "metadata" });
  const path = "/projects";
  const canonical = canonicalUrl(locale, path);
  return {
    title: { absolute: t("pages.projects.title") },
    description: t("pages.projects.description"),
    alternates: {
      canonical,
      languages: hreflangAlternates(path),
    },
    openGraph: {
      title: { absolute: t("pages.projects.title") },
      description: t("pages.projects.description"),
      url: canonical,
      images: [{ url: OG_IMAGE_URL, width: 1200, height: 630 }],
    },
    twitter: {
      title: { absolute: t("pages.projects.title") },
      description: t("pages.projects.description"),
    },
  };
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("projects");
  const projects = getProjects(locale);

  return (
    <div className="relative flex min-h-0 w-full flex-1 flex-col overflow-x-hidden text-foreground selection:bg-primary/30 lg:min-h-0 lg:overflow-hidden">
      <JsonLd
        schema={buildBreadcrumbSchema([
          { name: "Home", url: canonicalUrl(locale, "/home") },
          { name: t("title"), url: canonicalUrl(locale, "/projects") },
        ])}
      />
      {projects.map((p) => (
        <JsonLd key={p.slug} schema={buildProjectSchema(p, locale)} />
      ))}
      <main className="relative z-10 flex min-h-0 flex-1 flex-col px-0 py-4 sm:py-5 lg:overflow-hidden lg:py-5">
        {projects.length === 0 ? (
          <div className="mx-auto flex max-w-lg flex-1 flex-col items-center justify-center px-6 text-center lg:min-h-0">
            <h1 className="text-gradient-fade text-2xl font-bold tracking-tight sm:text-3xl">
              {t("empty.title")}
            </h1>
            <p className="mt-3 text-sm font-medium text-muted-foreground">{t("empty.body")}</p>
          </div>
        ) : (
          <ProjectsCarousel
            className="min-h-0 flex-1"
            title={t("title")}
            subtitle={t("subtitle")}
            slideIds={projects.map((p) => p.slug)}
          >
            {projects.map((project) => (
              <ProjectSlide key={project.slug} project={project} />
            ))}
          </ProjectsCarousel>
        )}
      </main>
    </div>
  );
}
