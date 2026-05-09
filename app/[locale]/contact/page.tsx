import { getTranslations, setRequestLocale } from "next-intl/server";
import { Mail, MapPin } from "lucide-react";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { MeshBackground } from "@/components/layout/mesh-background";
import { ContactSocialPanel } from "@/components/contact/contact-social-panel";
import { getProfile } from "@/lib/data";
import { mailtoDisplayAddress } from "@/lib/mailto-address";
import { isAppLocale } from "@/i18n/routing";
import type { Profile } from "@/types/profile";

function primaryEmailLink(profile: Profile) {
  return (
    profile.social.find((s) => s.platform === "email") ??
    profile.social.find((s) => s.url.toLowerCase().startsWith("mailto:")) ??
    null
  );
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("contact");
  const profile = getProfile(locale);
  const emailLink = primaryEmailLink(profile);
  const emailDisplay = emailLink
    ? mailtoDisplayAddress(emailLink.url)
    : null;

  return (
    <div className="relative flex min-h-dvh w-full flex-col overflow-hidden bg-background-dark text-white selection:bg-primary/30 lg:h-dvh">
      <MeshBackground withCornerAccents />
      <AppHeader profile={profile} />

      <main className="relative z-10 flex min-h-0 flex-1 flex-col items-center overflow-hidden px-4 py-4 sm:px-6 sm:py-5 md:px-8 lg:py-6">
        <div className="my-auto flex min-h-0 w-full max-w-5xl min-w-0 flex-col items-center gap-8 py-2 sm:gap-9 lg:gap-10">
          <header className="flex flex-col items-center text-center">
            {profile.availability ? (
              <div
                className="inline-flex w-fit max-w-full items-center gap-2 rounded-full border border-accent-emerald/35 bg-accent-emerald/18 px-3 py-1.5 text-xs font-semibold text-emerald-200"
                role="status"
              >
                <span className="relative flex h-2 w-2 shrink-0" aria-hidden>
                  <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-emerald opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-emerald shadow-[0_0_6px_rgba(16,185,129,0.7)]" />
                </span>
                <span className="text-pretty">{profile.availability.label}</span>
              </div>
            ) : null}

            <h1 className="mt-5 max-w-4xl text-balance text-4xl font-bold leading-[1.08] tracking-tight text-white sm:mt-6 sm:text-5xl sm:leading-[1.06] md:text-6xl md:leading-[1.05] lg:text-7xl lg:leading-[1.02]">
              <span>{t("headlineBefore")}</span>
              <span className="text-primary">{t("headlineAccent")}</span>
              <span>{t("headlineAfter")}</span>
            </h1>
            <p className="mt-4 max-w-xl text-pretty text-base font-medium leading-relaxed text-white/50 sm:mt-5">
              {t("subtitle")}
            </p>
          </header>

          <div className="flex w-full flex-col items-center gap-8 md:flex-row md:items-stretch md:justify-center md:gap-0">
            <div className="flex w-full max-w-md flex-col gap-6 md:w-auto md:pr-10 lg:pr-12">
              {emailLink && emailDisplay ? (
                <a
                  href={emailLink.url}
                  className="group/row flex min-w-0 w-full cursor-pointer items-center gap-4 rounded-xl outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary/60"
                >
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-colors group-hover/row:border-primary/50">
                    <Mail
                      aria-hidden
                      className="h-5 w-5 text-white/60 transition-colors group-hover/row:text-primary"
                      strokeWidth={1.75}
                    />
                  </span>
                  <span className="min-w-0 text-left">
                    <span className="block text-[10px] font-semibold uppercase tracking-widest text-white/40">
                      {t("emailLabel")}
                    </span>
                    <span className="block truncate text-sm font-medium text-white/85">
                      {emailDisplay}
                    </span>
                  </span>
                </a>
              ) : null}

              <div className="group/row flex w-full min-w-0 items-center gap-4">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-colors group-hover/row:border-accent-emerald/50">
                  <MapPin
                    aria-hidden
                    className="h-5 w-5 text-white/60 transition-colors group-hover/row:text-accent-emerald"
                    strokeWidth={1.75}
                  />
                </span>
                <span className="min-w-0 text-left">
                  <span className="block text-[10px] font-semibold uppercase tracking-widest text-white/40">
                    {t("locationLabel")}
                  </span>
                  <span className="block text-sm font-medium text-white/85">
                    {profile.location}
                  </span>
                </span>
              </div>
            </div>

            <div
              aria-hidden
              className="h-px w-full max-w-[14rem] shrink-0 bg-white/[0.12] md:hidden"
            />

            <div
              aria-hidden
              className="hidden w-px shrink-0 self-stretch bg-white/[0.12] md:block"
            />

            <div className="flex w-full flex-col items-center justify-center md:w-auto md:min-w-0 md:items-center md:pl-10 lg:pl-12">
              <ContactSocialPanel profile={profile} layout="besideContact" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
