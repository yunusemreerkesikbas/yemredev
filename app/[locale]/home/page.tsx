import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { BentoGrid } from "@/components/home/bento-grid";
import { EducationCTA } from "@/components/home/education-cta";
import { ExperienceTimeline } from "@/components/home/experience-timeline";
import { FeaturedProject } from "@/components/home/featured-project";
import { FloatingAssistantFab } from "@/components/home/floating-assistant-fab";
import { OpenSourceHighlight } from "@/components/home/open-source-highlight";
import { StatusBlock } from "@/components/home/status-block";
import { TechStack } from "@/components/home/tech-stack";
import { JsonLd } from "@/components/seo/json-ld";
import {
  getFeaturedProject,
  getOpenSource,
  getProfile,
} from "@/lib/data";
import {
  buildBreadcrumbSchema,
  buildPersonSchema,
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
  const path = "/home";
  const canonical = canonicalUrl(locale, path);
  return {
    title: { absolute: t("pages.home.title") },
    description: t("pages.home.description"),
    alternates: {
      canonical,
      languages: hreflangAlternates(path),
    },
    openGraph: {
      title: { absolute: t("pages.home.title") },
      description: t("pages.home.description"),
      url: canonical,
      images: [{ url: OG_IMAGE_URL, width: 1200, height: 630 }],
    },
    twitter: {
      title: { absolute: t("pages.home.title") },
      description: t("pages.home.description"),
    },
  };
}

/**
 * Phase 3 home / bento dashboard.
 *
 * Desktop (`lg+`): single-viewport, no page scroll. ExperienceTimeline plus other
 * tall bento cells use internal vertical scroll when content overflows (`min-h-0` +
 * `overflow-y-auto`). Mobile (`<lg`): bento collapses to a single column, page scroll allowed.
 *
 * All bento cards are server components. Header chrome lives in `LocaleShell`.
 * `FloatingAssistantFab` is a client `Link` that runs the reverse iris back to `/`.
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
  const hasOpenSource = openSource.length > 0;

  return (
    <div className="relative flex min-h-0 w-full flex-1 flex-col overflow-hidden text-foreground selection:bg-primary/30 lg:min-h-0 lg:overflow-hidden">
      <h1 className="sr-only">{profile.name}</h1>
      <JsonLd schema={buildPersonSchema(profile, locale)} />
      <JsonLd
        schema={buildBreadcrumbSchema([
          { name: "Home", url: canonicalUrl(locale, "/home") },
        ])}
      />
      <main className="relative z-10 flex min-h-0 flex-1 flex-col p-[10px] lg:overflow-hidden">
        <BentoGrid>
          <StatusBlock profile={profile} />
          <FeaturedProject
            project={featured}
            className={!hasOpenSource ? "lg:row-span-6" : undefined}
          />
          <TechStack skills={profile.skills} />
          <ExperienceTimeline experience={profile.experience} />
          {hasOpenSource && <OpenSourceHighlight project={openSource[0]} />}
          <EducationCTA education={profile.education} />
        </BentoGrid>
      </main>

      <FloatingAssistantFab />
    </div>
  );
}
