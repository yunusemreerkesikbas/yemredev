"use client";

import { useCallback } from "react";
import { ArrowRight } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useIrisTransition } from "@/components/layout/iris-transition-provider";

function shouldLetBrowserHandleClick(
  e: React.MouseEvent<HTMLAnchorElement>,
): boolean {
  return (
    e.metaKey ||
    e.ctrlKey ||
    e.shiftKey ||
    e.altKey ||
    e.button !== 0
  );
}

export function SkipIntroTransitionLink() {
  const t = useTranslations("landing.header");
  const router = useRouter();
  const reduceMotionPreference = useReducedMotion();
  const { beginSkipToHome, skipAriaBusy } = useIrisTransition();

  const navigateHome = useCallback(() => {
    router.push("/home");
  }, [router]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (shouldLetBrowserHandleClick(e)) return;

    if (reduceMotionPreference === true) {
      e.preventDefault();
      navigateHome();
      return;
    }

    e.preventDefault();
    beginSkipToHome();
  };

  const prefetchHome = useCallback(() => {
    router.prefetch("/home");
  }, [router]);

  return (
    <Link
      href="/home"
      prefetch
      aria-busy={skipAriaBusy || undefined}
      onClick={handleClick}
      onPointerEnter={prefetchHome}
      className="group inline-flex min-h-11 touch-manipulation items-center gap-2 rounded-lg border border-border bg-foreground/[0.05] px-4 text-sm font-semibold text-foreground/80 transition-[color,background-color,transform,box-shadow] duration-200 hover:bg-foreground/[0.09] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 dark:border-white/10 dark:bg-white/5 dark:text-white/75 dark:hover:bg-white/10 dark:hover:text-white sm:px-5"
    >
      <span>{t("skip")}</span>
      <ArrowRight
        aria-hidden
        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
      />
    </Link>
  );
}
