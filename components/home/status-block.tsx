import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { MapPin } from "lucide-react";
import type { Profile } from "@/types/profile";
import { SOCIAL_PLATFORM_ICON } from "@/lib/social-icons";
import { BentoCard } from "./bento-card";
import { cn } from "@/lib/utils";

type StatusBlockProps = {
  profile: Profile;
  className?: string;
};

/**
 * Top-left bento cell (taller). Identity header + footer stay fixed; tagline and
 * availability scroll when vertical space is tight (`lg` dashboard viewport).
 */
export async function StatusBlock({ profile, className }: StatusBlockProps) {
  const t = await getTranslations("home.status");

  return (
    <BentoCard
      className={cn(
        "min-h-0 lg:min-h-0 lg:col-start-1 lg:col-span-1 lg:row-start-1 lg:row-span-3",
        className,
      )}
    >
      <div className="flex shrink-0 items-start gap-4 border-b border-border pb-4 dark:border-white/10">
        <div className="relative flex h-[4.25rem] w-[4.25rem] shrink-0 overflow-hidden rounded-xl border border-black/[0.08] bg-[#fff] shadow-[0_6px_24px_-8px_rgba(59,184,247,0.35)] sm:h-[4.5rem] sm:w-[4.5rem]">
          <Image
            src="/brand/head.png"
            alt={profile.name}
            fill
            sizes="(max-width: 640px) 68px, 72px"
            quality={100}
            className="object-contain object-center"
            priority
            unoptimized
          />
          <span
            aria-hidden
            className="animate-pulse-slow pointer-events-none absolute -bottom-2 -right-2 z-10 h-2 w-2 rounded-full bg-accent-emerald shadow-[0_0_10px_rgba(16,185,129,0.75)]"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-pretty text-xl font-bold tracking-tight text-foreground sm:text-[1.35rem]">
            {profile.name}
          </h2>
          <p className="mt-0.5 text-pretty text-[11px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-xs">
            {profile.title}
          </p>
        </div>
      </div>

      <div className="thin-scrollbar flex flex-col gap-5 py-4 max-lg:flex-none max-lg:overflow-visible lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
        <p className="text-pretty text-[15px] font-normal leading-[1.65] tracking-[0.01em] text-foreground/70 sm:text-[15.5px]">
          {profile.tagline}
        </p>

        {profile.availability ? (
          <div
            className="inline-flex w-fit max-w-full items-center gap-1.5 rounded-full border border-accent-emerald/40 bg-accent-emerald/15 px-3 py-1.5 text-[11px] font-semibold text-emerald-900 dark:border-accent-emerald/35 dark:bg-accent-emerald/18 dark:text-emerald-200 sm:gap-2 sm:text-xs"
            role="status"
          >
            <span
              aria-hidden
              className="relative top-px size-1.5 shrink-0 animate-pulse-slow rounded-full bg-accent-emerald shadow-[0_0_6px_rgba(16,185,129,0.7)]"
            />
            <span className="min-w-0 leading-none">{profile.availability.label}</span>
          </div>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center justify-between gap-3 border-t border-border pt-4 dark:border-white/10">
        <div className="flex min-w-0 items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <MapPin aria-hidden className="h-3.5 w-3.5 shrink-0 text-primary/80" strokeWidth={1.75} />
          <span className="truncate">
            <span className="sr-only">{t("locationLabel")}: </span>
            {profile.location}
          </span>
        </div>

        <ul
          aria-label={t("socialLabel")}
          className="flex list-none items-center gap-1 p-0"
        >
          {profile.social.map((social) => {
            const Icon = SOCIAL_PLATFORM_ICON[social.platform];
            return (
              <li key={social.platform}>
                <a
                  href={social.url}
                  target={social.platform === "email" ? undefined : "_blank"}
                  rel={
                    social.platform === "email" ? undefined : "noopener noreferrer"
                  }
                  aria-label={social.label}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-foreground/[0.05] text-foreground/75 transition-all duration-200 hover:border-primary/35 hover:bg-foreground/[0.1] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 dark:border-white/10 dark:bg-white/[0.05] dark:text-white/75 dark:hover:bg-white/[0.12] dark:hover:text-white"
                >
                  <Icon aria-hidden className="h-4 w-4" strokeWidth={1.75} />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </BentoCard>
  );
}
