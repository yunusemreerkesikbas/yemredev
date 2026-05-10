"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const NAV_LINK_CLASS =
  "inline-flex min-h-11 min-w-[4.5rem] items-center justify-center rounded-lg px-4 text-sm font-semibold tracking-tight transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/55 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export function AppHeaderNav() {
  const t = useTranslations("appHeader");
  const pathname = usePathname();

  const items = [
    { href: "/home" as const, label: t("nav.home") },
    { href: "/projects" as const, label: t("nav.projects") },
    { href: "/contact" as const, label: t("nav.contact") },
  ];

  return (
    <nav
      aria-label={t("nav.label")}
      className="hidden items-center gap-1 md:flex"
    >
      {items.map(({ href, label }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              NAV_LINK_CLASS,
              active
                ? "text-foreground underline decoration-primary/70 underline-offset-[10px] dark:text-white"
                : "text-muted-foreground hover:text-foreground dark:text-white/60 dark:hover:text-white",
            )}
            aria-current={active ? "page" : undefined}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
