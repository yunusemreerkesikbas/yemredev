import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ChatIsland } from "@/components/chat/chat-island";
import { LandingFooter } from "@/components/landing/landing-footer";
import { isAppLocale } from "@/i18n/routing";
import { canonicalUrl, hreflangAlternates, OG_IMAGE_URL } from "@/lib/seo";
import type { ChipKey } from "@/components/landing/quick-action-chips";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const path = "";
  const canonical = canonicalUrl(locale, path);
  return {
    title: { absolute: t("pages.landing.title") },
    description: t("pages.landing.description"),
    alternates: {
      canonical,
      languages: hreflangAlternates(path),
    },
    openGraph: {
      title: { absolute: t("pages.landing.title") },
      description: t("pages.landing.description"),
      url: canonical,
      images: [{ url: OG_IMAGE_URL, width: 1200, height: 630 }],
    },
    twitter: {
      title: { absolute: t("pages.landing.title") },
      description: t("pages.landing.description"),
    },
  };
}

const CHIP_KEYS: ChipKey[] = [
  "skills",
  "experience",
  "resume",
  "craftive",
];

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  setRequestLocale(locale);

  const tPrompts = await getTranslations("landing.chips.prompts");

  const prompts = Object.fromEntries(
    CHIP_KEYS.map((key) => [key, tPrompts(key)]),
  ) as Record<ChipKey, string>;

  return (
    <div className="relative flex min-h-full w-full min-w-0 shrink-0 flex-col overflow-x-hidden text-foreground selection:bg-primary/30">
      <main className="relative z-10 mx-auto flex min-h-0 w-full min-w-0 max-w-4xl flex-1 flex-col px-4 sm:px-6">
        <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col items-center justify-center">
          <ChatIsland locale={locale} prompts={prompts} />
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
