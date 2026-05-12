"use client";

import { useTranslations } from "next-intl";
import { Bot } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

const easeOut = [0.22, 1, 0.36, 1] as const;

export function LandingHero() {
  const t = useTranslations("landing.hero");
  const reducedMotion = useReducedMotion();

  return (
    <div className="flex w-full flex-col items-center text-center">
      <motion.div
        className="group relative mb-7 flex h-[68px] w-[68px] items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-gray-800 to-black shadow-[0_8px_40px_-12px_rgba(59,184,247,0.45),0_0_0_1px_rgba(255,255,255,0.04)_inset]"
        role="img"
        aria-label={t("avatarAlt")}
        initial={reducedMotion ? false : { opacity: 0, scale: 0.92, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: reducedMotion ? 0 : 0.5, ease: easeOut }}
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
      </motion.div>

      <div className="max-w-2xl space-y-4">
        <motion.div
          className="flex flex-col items-center gap-3"
          initial={reducedMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reducedMotion ? 0 : 0.58,
            delay: reducedMotion ? 0 : 0.06,
            ease: easeOut,
          }}
        >
          <h1
            className="text-gradient-fade text-balance pb-1 text-4xl font-extrabold leading-[1.05] tracking-[-0.04em] md:text-[3.5rem] md:leading-[1.02]"
            style={{ fontFeatureSettings: '"ss01" 1, "ss02" 1, "kern" 1' }}
          >
            {t("title")}
          </h1>
          <div className="landing-hero-accent-line motion-reduce:animate-none" />
        </motion.div>
        <motion.p
          className="text-pretty mx-auto max-w-lg text-base font-normal leading-relaxed tracking-tight text-muted-foreground sm:text-lg"
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reducedMotion ? 0 : 0.5,
            delay: reducedMotion ? 0 : 0.18,
            ease: easeOut,
          }}
        >
          {t("subtitle")}
        </motion.p>
      </div>
    </div>
  );
}
