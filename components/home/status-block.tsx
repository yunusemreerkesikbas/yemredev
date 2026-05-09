import { useTranslations } from "next-intl";
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
 * Top-left bento cell. Personal anchor: avatar block + name + role +
 * tagline + availability dot + location + social shortcuts. Static
 * server component.
 */
export function StatusBlock({ profile, className }: StatusBlockProps) {
  const t = useTranslations("home.status");

  return (
    <BentoCard
      className={cn(
        "lg:col-start-1 lg:col-span-1 lg:row-start-1 lg:row-span-2",
        className,
      )}
    >
      <div className="flex items-start gap-4">
        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/14 bg-gradient-to-br from-zinc-800 to-black shadow-[0_6px_24px_-8px_rgba(59,184,247,0.4),inset_0_1px_0_rgba(255,255,255,0.08)]">
          <span className="text-base font-bold tracking-tighter text-white">
            {profile.initials}
          </span>
          <span
            aria-hidden
            className="animate-pulse-slow absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[rgba(12,12,14,0.95)] bg-accent-emerald shadow-[0_0_10px_rgba(16,185,129,0.75)]"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-lg font-bold tracking-tight text-white">
            {profile.name}
          </h2>
          <p className="truncate text-xs font-semibold uppercase tracking-wider text-white/60">
            {profile.title}
          </p>
        </div>
      </div>

      <p className="text-pretty mt-4 text-sm font-medium leading-relaxed text-white/80">
        {profile.tagline}
      </p>

      {profile.availability ? (
        <div
          className="mt-4 inline-flex w-fit items-center gap-2 rounded-full border border-accent-emerald/35 bg-accent-emerald/18 px-2.5 py-1 text-[11px] font-semibold text-emerald-200"
          role="status"
        >
          <span
            aria-hidden
            className="animate-pulse-slow h-1.5 w-1.5 rounded-full bg-accent-emerald shadow-[0_0_6px_rgba(16,185,129,0.7)]"
          />
          <span>{profile.availability.label}</span>
        </div>
      ) : null}

      <div className="mt-auto flex items-center justify-between gap-3 pt-4">
        <div className="flex min-w-0 items-center gap-1.5 text-xs font-medium text-white/65">
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
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-white/75 transition-all duration-200 hover:border-primary/35 hover:bg-white/[0.12] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
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
