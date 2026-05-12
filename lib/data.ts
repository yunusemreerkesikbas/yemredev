import "server-only";

import { cache } from "react";
import type { AppLocale } from "@/i18n/routing";
import type { Profile } from "@/types/profile";
import type { Project } from "@/types/project";
import profileEn from "@/content/profile.en.json";
import profileTr from "@/content/profile.tr.json";
import projectsEn from "@/content/projects.en.json";
import projectsTr from "@/content/projects.tr.json";

const profileByLocale: Record<AppLocale, Profile> = {
  en: profileEn as Profile,
  tr: profileTr as Profile,
};

const projectsByLocale: Record<AppLocale, Project[]> = {
  en: projectsEn as Project[],
  tr: projectsTr as Project[],
};

export const getProfile = cache((locale: AppLocale): Profile => {
  return profileByLocale[locale];
});

export const getProjects = cache((locale: AppLocale): Project[] => {
  return projectsByLocale[locale];
});

export const getProject = cache(
  (locale: AppLocale, slug: string): Project | undefined => {
    return projectsByLocale[locale].find((project) => project.slug === slug);
  },
);

/**
 * Returns the project flagged `featured: true`, falling back to the first
 * entry, or null when the locale's project list is empty. Used by the
 * home bento `FeaturedProject` card.
 */
export const getFeaturedProject = cache(
  (locale: AppLocale): Project | null => {
    const list = projectsByLocale[locale];
    if (list.length === 0) return null;
    return list.find((p) => p.featured) ?? list[0];
  },
);
