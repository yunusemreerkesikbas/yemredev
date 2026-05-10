import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://yemredev.com").replace(/\/$/, "");

const STATIC_PATHS: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "", changeFrequency: "monthly", priority: 1.0 },
  { path: "/home", changeFrequency: "weekly", priority: 0.9 },
  { path: "/projects", changeFrequency: "weekly", priority: 0.8 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return STATIC_PATHS.map(({ path, changeFrequency, priority }) => ({
    url: `${SITE_URL}/en${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${SITE_URL}/${l}${path}`])
      ),
    },
  }));
}
