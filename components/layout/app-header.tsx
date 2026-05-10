import { useTranslations } from "next-intl";
import type { Profile } from "@/types/profile";
import { AppHeaderNav } from "./app-header-nav";
import { HeaderLogo } from "./header-logo";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeToggle } from "./theme-toggle";

type AppHeaderProps = {
  profile: Profile;
};

export function AppHeader({ profile: _profile }: AppHeaderProps) {
  const tHeader = useTranslations("header");

  return (
    <header className="relative z-20 flex min-h-[64px] w-full items-center justify-between border-b border-border bg-background/90 px-4 py-2 backdrop-blur-md sm:px-6 md:min-h-[72px] md:px-8 dark:bg-background-dark/55">
      <HeaderLogo href="/home" ariaLabel={tHeader("logo")} />

      <AppHeaderNav />

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
    </header>
  );
}
