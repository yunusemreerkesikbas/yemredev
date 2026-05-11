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

const CHIP_KEYS: ChipKey[] = ["skills", "github", "experience", "resume"];

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
    <div className="relative flex w-full max-lg:shrink-0 flex-col overflow-x-hidden text-foreground selection:bg-primary/30 lg:flex-1 lg:min-h-0 lg:overflow-hidden">
      <main className="relative z-10 mx-auto flex w-full max-w-4xl flex-col px-4 sm:px-6 lg:flex-1 lg:min-h-0 lg:overflow-hidden">
        <div className="flex w-full flex-col lg:flex-1 lg:min-h-0">
          <ChatIsland locale={locale} prompts={prompts} />
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
