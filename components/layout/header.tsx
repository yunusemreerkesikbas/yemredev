import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  const t = useTranslations("header");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-foreground/5 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-foreground transition-opacity hover:opacity-80"
        >
          {t("logo")}
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-foreground/70 md:flex">
          <Link
            href="/home"
            className="transition-colors hover:text-foreground"
          >
            {t("nav.home")}
          </Link>
          <Link
            href="/portfolio"
            className="transition-colors hover:text-foreground"
          >
            {t("nav.portfolio")}
          </Link>
          <Link
            href="/contact"
            className="transition-colors hover:text-foreground"
          >
            {t("nav.contact")}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
