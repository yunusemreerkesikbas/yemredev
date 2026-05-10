import { useTranslations } from "next-intl";
import { Bot } from "lucide-react";

export function LandingHero() {
  const t = useTranslations("landing.hero");

  return (
    <div className="flex w-full flex-col items-center text-center">
      {/* Avatar — primary inner glow + ring halo + pulsing online dot.
          Aria label exposes the role; icon itself is decorative. */}
      <div
        className="group relative mb-7 flex h-[68px] w-[68px] items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-gray-800 to-black shadow-[0_8px_40px_-12px_rgba(59,184,247,0.45),0_0_0_1px_rgba(255,255,255,0.04)_inset]"
        role="img"
        aria-label={t("avatarAlt")}
      >
        <div
          aria-hidden
          className="absolute inset-0 bg-primary/25 blur-2xl transition-all duration-500 group-hover:bg-primary/40"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
        />
        <Bot
          aria-hidden
          className="relative z-10 h-8 w-8 text-primary drop-shadow-[0_0_8px_rgba(59,184,247,0.45)]"
          strokeWidth={1.75}
        />
        <span
          aria-hidden
          className="animate-pulse-slow absolute bottom-1 right-1 h-2 w-2 rounded-full bg-accent-emerald shadow-[0_0_10px_rgba(16,185,129,0.7)]"
        />
      </div>

      <div className="max-w-2xl space-y-4">
        <h1
          className="text-gradient-fade text-balance pb-2 text-4xl font-extrabold leading-[1.05] tracking-[-0.04em] md:text-[3.5rem] md:leading-[1.02]"
          style={{ fontFeatureSettings: '"ss01" 1, "ss02" 1, "kern" 1' }}
        >
          {t("title")}
        </h1>
        <p className="text-pretty mx-auto max-w-lg text-base font-normal leading-relaxed tracking-tight text-muted-foreground sm:text-lg">
          {t("subtitle")}
        </p>
      </div>
    </div>
  );
}
