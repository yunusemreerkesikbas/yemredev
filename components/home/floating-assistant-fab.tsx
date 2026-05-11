"use client";

import { useCallback } from "react";
import { Bot } from "lucide-react";
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

/**
 * Bottom-right FAB on the home dashboard. Inverse of the landing's
 * "Skip Intro" CTA — primary navigates to the AI assistant landing with an
 * iris transition that mirrors Skip Intro in reverse (`toLanding`).
 */
export function FloatingAssistantFab() {
  const t = useTranslations("home.fab");
  const router = useRouter();
  const reduceMotionPreference = useReducedMotion();
  const { beginFabToLanding, fabAriaBusy } = useIrisTransition();

  const navigateLanding = useCallback(() => {
    router.push("/");
  }, [router]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (shouldLetBrowserHandleClick(e)) return;

    if (reduceMotionPreference === true) {
      e.preventDefault();
      navigateLanding();
      return;
    }

    e.preventDefault();
    beginFabToLanding();
  };

  const prefetchLanding = useCallback(() => {
    router.prefetch("/");
  }, [router]);

  return (
    <Link
      href="/"
      prefetch
      aria-label={t("ariaLabel")}
      title={t("tooltip")}
      aria-busy={fabAriaBusy || undefined}
      onClick={handleClick}
      onPointerEnter={prefetchLanding}
      className="group fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-30 inline-flex h-14 w-14 touch-manipulation items-center justify-center rounded-full border border-white/16 bg-gradient-to-br from-zinc-900/95 via-zinc-950/95 to-black/95 text-white shadow-[0_10px_40px_-10px_rgba(59,184,247,0.42),0_0_0_1px_rgba(0,0,0,0.35)_inset,0_1px_0_rgba(255,255,255,0.1)_inset] backdrop-blur-xl transition-[transform,opacity,border-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-primary/55 hover:shadow-[0_16px_48px_-12px_rgba(59,184,247,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
    >
      <span
        aria-hidden
        className="absolute inset-0 rounded-full bg-primary/15 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100"
      />
      <Bot
        aria-hidden
        className="relative z-10 h-6 w-6 text-primary drop-shadow-[0_0_6px_rgba(59,184,247,0.6)]"
        strokeWidth={1.75}
      />
      <span
        aria-hidden
        className="animate-pulse-slow absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent-emerald shadow-[0_0_8px_rgba(16,185,129,0.7)]"
      />
    </Link>
  );
}
