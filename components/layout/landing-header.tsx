import { useTranslations } from "next-intl";
import type { Profile } from "@/types/profile";
import { HeaderLogo } from "./header-logo";
import { LanguageSwitcher } from "./language-switcher";
import { MobileSiteDrawer } from "./mobile-site-drawer";
import { SkipIntroTransitionLink } from "./skip-intro-transition";
import { ThemeToggle } from "./theme-toggle";

type LandingHeaderProps = {
  profile: Profile;
};

export function LandingHeader({ profile: _profile }: LandingHeaderProps) {
  const tHeader = useTranslations("header");

  return (
    <header className="relative z-20 flex min-h-[64px] min-w-0 w-full items-center justify-between gap-2 border-b border-border bg-background/90 px-4 py-2 backdrop-blur-md sm:px-6 md:min-h-[72px] md:px-10 dark:bg-background-dark/55">
      <HeaderLogo href="/" ariaLabel={tHeader("logoAriaLanding")} />

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <SkipIntroTransitionLink />

        <div className="hidden items-center gap-2 sm:gap-3 md:flex">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
        <MobileSiteDrawer />
      </div>
    </header>
  );
}
