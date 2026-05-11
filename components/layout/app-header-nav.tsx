"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { APP_HEADER_NAV_ITEMS, NAV_LINK_CLASS } from "@/components/layout/app-header-links";
import { cn } from "@/lib/utils";

export function AppHeaderNav() {
  const t = useTranslations("appHeader");
  const pathname = usePathname();

  return (
    <nav
      aria-label={t("nav.label")}
      className="hidden items-center gap-1 md:flex"
    >
      {APP_HEADER_NAV_ITEMS.map(({ href, labelKey }) => {
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
            {t(labelKey)}
          </Link>
        );
      })}
    </nav>
  );
}
