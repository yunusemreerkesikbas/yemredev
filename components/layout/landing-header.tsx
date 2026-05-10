import { useTranslations } from "next-intl";
import type { Profile } from "@/types/profile";
import { HeaderLogo } from "./header-logo";
import { LanguageSwitcher } from "./language-switcher";
import { SkipIntroTransitionLink } from "./skip-intro-transition";
import { ThemeToggle } from "./theme-toggle";

type LandingHeaderProps = {
  profile: Profile;
};

export function LandingHeader({ profile: _profile }: LandingHeaderProps) {
  const t = useTranslations("landing.header");
  const tHeader = useTranslations("header");

  return (
    <header className="relative z-20 flex min-h-[64px] w-full items-center justify-between border-b border-border bg-background/90 px-4 py-2 backdrop-blur-md sm:px-6 md:min-h-[72px] md:px-10 dark:bg-background-dark/55">
      <HeaderLogo href="/" ariaLabel={tHeader("logo")} />

      <div className="flex flex-shrink-0 items-center gap-2 sm:gap-3">
        <kbd
          aria-hidden
          className="hidden h-7 items-center justify-center rounded border border-border bg-foreground/[0.04] px-2 font-mono text-[11px] font-medium text-muted-foreground shadow-[inset_0_1px_0_rgba(0,0,0,0.04)] md:inline-flex dark:border-white/10 dark:bg-white/[0.04] dark:text-white/50 dark:shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]"
        >
          {t("cmdkHint")}
        </kbd>

        <SkipIntroTransitionLink />

        <LanguageSwitcher />
        <ThemeToggle />
      </div>
    </header>
  );
}
