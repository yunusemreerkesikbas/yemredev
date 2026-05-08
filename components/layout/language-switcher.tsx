"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations("header.language");
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale() as AppLocale;
  const [isPending, startTransition] = useTransition();

  const switchTo = (locale: AppLocale) => {
    if (locale === currentLocale) return;
    startTransition(() => {
      router.replace(pathname, { locale });
    });
  };

  return (
    <div
      role="group"
      aria-label={t("label")}
      className={cn(
        "inline-flex h-9 items-center rounded-md border border-foreground/10 bg-background p-0.5 text-xs font-medium text-foreground/70",
        className,
      )}
    >
      {routing.locales.map((locale) => {
        const active = locale === currentLocale;
        return (
          <button
            key={locale}
            type="button"
            onClick={() => switchTo(locale)}
            aria-pressed={active}
            disabled={isPending}
            className={cn(
              "h-8 rounded-[5px] px-2.5 uppercase tracking-wide transition-colors",
              active
                ? "bg-foreground text-background"
                : "hover:bg-foreground/5",
            )}
          >
            {locale}
          </button>
        );
      })}
    </div>
  );
}
