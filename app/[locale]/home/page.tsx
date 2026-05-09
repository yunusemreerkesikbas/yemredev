import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { MeshBackground } from "@/components/layout/mesh-background";
import { BentoGrid } from "@/components/home/bento-grid";
import { EducationCTA } from "@/components/home/education-cta";
import { ExperienceTimeline } from "@/components/home/experience-timeline";
import { FeaturedProject } from "@/components/home/featured-project";
import { FloatingAssistantFab } from "@/components/home/floating-assistant-fab";
import { OpenSourceHighlight } from "@/components/home/open-source-highlight";
import { StatusBlock } from "@/components/home/status-block";
import { TechStack } from "@/components/home/tech-stack";
import {
  getFeaturedProject,
  getOpenSource,
  getProfile,
} from "@/lib/data";
import { isAppLocale } from "@/i18n/routing";

/**
 * Phase 3 home / bento dashboard.
 *
 * Desktop (`lg+`): single-viewport, no page scroll. Only the
 * ExperienceTimeline scrolls internally (hard rule from DESIGN.md §7.2).
 * Mobile (`<lg`): bento collapses to a single column, page scroll allowed.
 *
 * All cards are server components — zero new client islands beyond what
 * AppHeader already ships (LanguageSwitcher + ThemeToggle).
 */
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  setRequestLocale(locale);

  const profile = getProfile(locale);
  const featured = getFeaturedProject(locale);
  const openSource = getOpenSource(locale);

  return (
    <div className="relative flex min-h-dvh w-full flex-col overflow-hidden bg-background-dark text-white selection:bg-primary/30 lg:h-dvh">
      <MeshBackground withCornerAccents />

      <AppHeader profile={profile} />

      <main className="relative z-10 flex flex-1 flex-col px-4 py-4 sm:px-6 sm:py-5 md:px-8 lg:overflow-hidden lg:py-6">
        <BentoGrid>
          <StatusBlock profile={profile} />
          <FeaturedProject project={featured} />
          <TechStack skills={profile.skills} />
          <ExperienceTimeline experience={profile.experience} />
          <OpenSourceHighlight project={openSource[0] ?? null} />
          <EducationCTA education={profile.education} />
        </BentoGrid>
      </main>

      <FloatingAssistantFab />
    </div>
  );
}
