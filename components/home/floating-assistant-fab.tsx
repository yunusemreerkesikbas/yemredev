import { useTranslations } from "next-intl";
import { Bot } from "lucide-react";
import { Link } from "@/i18n/navigation";

/**
 * Bottom-right FAB on the home dashboard. Inverse of the landing's
 * "Skip Intro" CTA — gives the visitor a way back to the AI assistant
 * once they're inside the app. No internal state; it's a styled `<Link>`.
 *
 * The FAB sits above the bento grid (`z-30`), respects safe-area insets,
 * and is hidden on the smallest screens to avoid overlapping the stacked
 * cards' tap targets.
 */
export function FloatingAssistantFab() {
  const t = useTranslations("home.fab");

  return (
    <Link
      href="/"
      aria-label={t("ariaLabel")}
      title={t("tooltip")}
      className="group fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-30 hidden h-14 w-14 items-center justify-center rounded-full border border-white/16 bg-gradient-to-br from-zinc-900/95 via-zinc-950/95 to-black/95 text-white shadow-[0_10px_40px_-10px_rgba(59,184,247,0.42),0_0_0_1px_rgba(0,0,0,0.35)_inset,0_1px_0_rgba(255,255,255,0.1)_inset] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/55 hover:shadow-[0_16px_48px_-12px_rgba(59,184,247,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 sm:inline-flex"
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
