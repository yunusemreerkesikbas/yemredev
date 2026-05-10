import type { Profile } from "@/types/profile";
import type { Project } from "@/types/project";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://yemredev.com").replace(/\/$/, "");

export function canonicalUrl(locale: string, path: string): string {
  return `${SITE_URL}/${locale}${path}`;
}

export function hreflangAlternates(path: string): Record<string, string> {
  return {
    en: canonicalUrl("en", path),
    tr: canonicalUrl("tr", path),
    "x-default": canonicalUrl("en", path),
  };
}

export const OG_IMAGE_URL = `${SITE_URL}/og-image.png`;

export function buildPersonSchema(profile: Profile, locale: string): object {
  const sameAs = profile.social
    .filter((s) => s.url.startsWith("http"))
    .map((s) => s.url);

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.title,
    description: profile.tagline,
    url: canonicalUrl(locale, "/home"),
    ...(profile.avatar ? { image: `${SITE_URL}${profile.avatar}` } : {}),
    sameAs,
    address: {
      "@type": "PostalAddress",
      addressLocality: profile.location,
    },
  };
}

export function buildBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildProjectSchema(project: Project, locale: string): object {
  const liveUrl = project.links.find((l) => l.type === "live")?.url;
  const repoUrl = project.links.find((l) => l.type === "repo")?.url;
  const isSoftware =
    project.category === "saas" || project.category === "tool";

  return {
    "@context": "https://schema.org",
    "@type": isSoftware ? "SoftwareApplication" : "CreativeWork",
    name: project.title,
    description: project.summary,
    ...(isSoftware ? { applicationCategory: "WebApplication" } : {}),
    author: {
      "@type": "Person",
      name: "Yunus Emre Erkesikbaş",
      url: canonicalUrl(locale, "/home"),
    },
    dateCreated: String(project.year),
    ...(liveUrl ? { url: liveUrl } : {}),
    ...(repoUrl ? { codeRepository: repoUrl } : {}),
    ...(project.stack.length > 0
      ? { programmingLanguage: project.stack }
      : {}),
  };
}
