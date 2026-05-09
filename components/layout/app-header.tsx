import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Profile } from "@/types/profile";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeToggle } from "./theme-toggle";

type AppHeaderProps = {
  profile: Profile;
};

export function AppHeader({ profile }: AppHeaderProps) {
  const t = useTranslations("appHeader");
  const tHeader = useTranslations("header");

  return (
    <header className="relative z-20 flex h-[70px] w-full items-center justify-between border-b border-border-dark bg-background-dark/50 px-4 backdrop-blur-md sm:px-6 md:px-8">
      <Link
        href="/home"
        className="group flex items-center gap-3"
        aria-label={tHeader("logo")}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-gradient-to-br from-white/10 to-white/5 text-white transition-colors group-hover:border-primary/50 group-hover:text-primary">
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

      <nav
        aria-label={t("nav.label")}
        className="hidden items-center gap-6 text-xs font-medium text-white/60 md:flex"
      >
        <Link
          href="/home"
          className="transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none"
        >
          {t("nav.home")}
        </Link>
        <Link
          href="/projects"
          className="transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none"
        >
          {t("nav.projects")}
        </Link>
        <Link
          href="/contact"
          className="transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none"
        >
          {t("nav.contact")}
        </Link>
      </nav>

      <div className="flex items-center gap-2 sm:gap-3">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
    </header>
  );
}
