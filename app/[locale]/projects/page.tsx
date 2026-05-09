import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { MeshBackground } from "@/components/layout/mesh-background";
import { ProjectSlide } from "@/components/projects/project-slide";
import { ProjectsCarousel } from "@/components/projects/projects-carousel";
import { getProfile, getProjects } from "@/lib/data";
import { isAppLocale } from "@/i18n/routing";

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("projects");
  const profile = getProfile(locale);
  const projects = getProjects(locale);

  return (
    <div className="relative flex min-h-dvh w-full flex-col overflow-x-hidden bg-background-dark text-white selection:bg-primary/30 lg:h-dvh lg:overflow-hidden">
      <MeshBackground withCornerAccents />
      <AppHeader profile={profile} />

      <main className="relative z-10 flex flex-1 flex-col px-0 py-4 sm:py-5 lg:min-h-0 lg:overflow-hidden lg:py-5">
        {projects.length === 0 ? (
          <div className="mx-auto flex max-w-lg flex-1 flex-col items-center justify-center px-6 text-center lg:min-h-0">
            <h1 className="text-gradient-fade text-2xl font-bold tracking-tight sm:text-3xl">
              {t("empty.title")}
            </h1>
            <p className="mt-3 text-sm font-medium text-white/65">{t("empty.body")}</p>
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
