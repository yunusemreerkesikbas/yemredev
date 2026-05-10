"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { motion, useReducedMotion } from "motion/react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const THUMB_LAYOUT_ID = "header-language-thumb";

export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations("header.language");
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale() as AppLocale;
  const [isPending, startTransition] = useTransition();
  const prefersReducedMotion = useReducedMotion();

  const thumbTransition =
    prefersReducedMotion === true
      ? { duration: 0 }
      : { type: "spring" as const, stiffness: 420, damping: 34, mass: 0.9 };

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
        "relative inline-flex h-11 items-stretch rounded-lg border border-foreground/10 bg-background p-1 text-sm font-semibold text-foreground/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
        isPending && "pointer-events-none opacity-70",
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
              "relative z-0 flex flex-1 items-center justify-center rounded-md px-3 uppercase tracking-wide transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            )}
          >
            {active ? (
              <motion.div
                layoutId={THUMB_LAYOUT_ID}
                className="absolute inset-0 z-0 rounded-md bg-foreground shadow-[0_1px_2px_rgba(0,0,0,0.12)]"
                transition={thumbTransition}
                aria-hidden
              />
            ) : null}
            <span
              className={cn(
                "relative z-10",
                active ? "text-background" : "text-foreground/65 hover:text-foreground/90",
              )}
            >
              {locale}
            </span>
          </button>
        );
      })}
    </div>
  );
}
