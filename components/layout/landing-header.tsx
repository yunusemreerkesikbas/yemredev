import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Profile } from "@/types/profile";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeToggle } from "./theme-toggle";

type LandingHeaderProps = {
  profile: Profile;
};

export function LandingHeader({ profile }: LandingHeaderProps) {
  const t = useTranslations("landing.header");
  const tHeader = useTranslations("header");

  return (
    <header className="relative z-20 flex h-[70px] w-full items-center justify-between border-b border-border-dark bg-background-dark/50 px-4 backdrop-blur-md sm:px-6 md:px-10">
      <Link
        href="/"
        className="group flex items-center gap-3"
        aria-label={tHeader("logo")}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white transition-colors group-hover:border-primary/50 group-hover:bg-primary/10">
          <span className="text-sm font-bold tracking-tighter">
            {profile.initials}
          </span>
        </div>
        <div className="hidden flex-col sm:flex">
          <span className="text-sm font-semibold leading-tight text-white/90">
            {profile.name}
          </span>
          <span className="text-[10px] font-medium uppercase tracking-wider text-white/50">
            {profile.title}
          </span>
        </div>
      </Link>

      <div className="flex items-center gap-2 sm:gap-3">
        <kbd
          aria-hidden
          className="hidden h-7 items-center justify-center rounded border border-white/10 bg-white/[0.04] px-2 font-mono text-[11px] font-medium text-white/50 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset] md:inline-flex"
        >
          {t("cmdkHint")}
        </kbd>

        <Link
          href="/home"
          className="group inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 text-xs font-medium text-white/70 transition-all duration-200 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 sm:px-4"
        >
          <span>{t("skip")}</span>
          <ArrowRight
            aria-hidden
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </Link>

        <LanguageSwitcher />
        <ThemeToggle />
      </div>
    </header>
  );
}
