import { setRequestLocale } from "next-intl/server";
import { ChatInputBar } from "@/components/landing/chat-input-bar";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingHero } from "@/components/landing/landing-hero";
import { QuickActionChips } from "@/components/landing/quick-action-chips";
import { LandingHeader } from "@/components/layout/landing-header";
import { MeshBackground } from "@/components/layout/mesh-background";
import { getProfile } from "@/lib/data";
import { isAppLocale } from "@/i18n/routing";
import { notFound } from "next/navigation";

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  setRequestLocale(locale);

  const profile = getProfile(locale);

  return (
    <div className="relative flex min-h-dvh w-full flex-col overflow-hidden bg-background-dark text-white selection:bg-primary/30">
      <MeshBackground withCenterPulse withSparkles />

      <LandingHeader profile={profile} />

      <main className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-4 sm:px-6">
        <div className="flex w-full flex-col items-center gap-10 py-10">
          <LandingHero />
          <QuickActionChips />
          <ChatInputBar />
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
