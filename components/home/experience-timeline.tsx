"use client";

import { useTranslations } from "next-intl";
import { Briefcase } from "lucide-react";
import { motion, useMotionValue, useReducedMotion } from "motion/react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { Experience } from "@/types/profile";
import { cn } from "@/lib/utils";

type ExperienceTimelineProps = {
  experience: Experience[];
  className?: string;
};

/**
 * Right column bento cell, full vertical span. Internal scroll only (DESIGN.md §7.2).
 * Scroll-linked timeline rail: accent fill grows with list scroll; active node follows
 * the focal line in the viewport. Honors `prefers-reduced-motion`.
 */
export function ExperienceTimeline({
  experience,
  className,
}: ExperienceTimelineProps) {
  const t = useTranslations("home.experience");
  const scrollRef = useRef<HTMLOListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const scrollProgress = useMotionValue(0);
  const reducedMotion = useReducedMotion();
  const [activeIdx, setActiveIdx] = useState(0);

  const setItemRef = useCallback((el: HTMLLIElement | null, index: number) => {
    itemRefs.current[index] = el;
  }, []);

  const updateScrollMetrics = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const maxScroll = el.scrollHeight - el.clientHeight;
    const progress =
      maxScroll <= 0 ? 1 : Math.min(1, Math.max(0, el.scrollTop / maxScroll));
    scrollProgress.set(progress);

    const focalY = el.scrollTop + el.clientHeight * 0.36;
    let nextActive = 0;
    itemRefs.current.forEach((node, i) => {
      if (!node) return;
      const top = node.offsetTop;
      if (top <= focalY + 12) nextActive = i;
    });
    setActiveIdx(nextActive);
  }, [scrollProgress]);

  useLayoutEffect(() => {
    updateScrollMetrics();
  }, [experience, updateScrollMetrics]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollMetrics();
    el.addEventListener("scroll", updateScrollMetrics, { passive: true });
    const ro = new ResizeObserver(updateScrollMetrics);
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", updateScrollMetrics);
      ro.disconnect();
    };
  }, [updateScrollMetrics]);

  return (
    <section
      className={cn(
        "glass-bento-surface relative flex min-h-0 flex-col overflow-hidden rounded-2xl lg:col-start-4 lg:col-span-1 lg:row-start-1 lg:row-span-4",
        className,
      )}
    >
      <header className="relative sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-border bg-background/95 px-5 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-gradient-to-b dark:from-[rgba(14,14,16,0.97)] dark:via-[rgba(10,10,12,0.92)] dark:to-[rgba(10,10,12,0.78)]">
        <div className="flex items-center gap-2">
          <span className="relative flex h-7 w-7 items-center justify-center rounded-lg border border-primary/25 bg-primary/[0.07] shadow-[0_0_20px_-6px_rgba(59,184,247,0.55)] dark:border-primary/30 dark:bg-primary/[0.09]">
            <Briefcase
              aria-hidden
              className="h-4 w-4 text-primary"
              strokeWidth={1.75}
            />
          </span>
          <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground dark:text-white/72">
            {t("title")}
          </h2>
        </div>
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent opacity-70"
        />
      </header>

      <div className="relative flex-1 overflow-hidden">
        {/* Track */}
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-4 left-[26px] top-4 z-0 w-px -translate-x-1/2 rounded-full bg-gradient-to-b from-foreground/14 via-foreground/8 to-transparent dark:from-white/16 dark:via-white/9"
        />
        {/* Scroll progress fill — transform-only */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute bottom-4 left-[26px] top-4 z-[1] w-[3px] -translate-x-1/2 origin-top rounded-full bg-gradient-to-b from-primary via-primary/88 to-primary/15 shadow-[0_0_14px_rgba(59,184,247,0.42)] dark:shadow-[0_0_18px_rgba(59,184,247,0.38)]"
          style={{
            scaleY: reducedMotion ? 1 : scrollProgress,
          }}
        />

        <ol
          ref={scrollRef}
          className="no-scrollbar relative h-full list-none overflow-y-auto px-5 py-4"
        >
          {experience.map((entry, idx) => {
            const state =
              idx === activeIdx ? "active" : idx < activeIdx ? "past" : "future";

            return (
              <li
                key={`${entry.company}-${entry.start}`}
                ref={(el) => setItemRef(el, idx)}
                className={cn(
                  "relative pl-6 transition-[opacity] duration-300 ease-out motion-reduce:transition-none",
                  idx > 0 && "mt-5",
                  state === "future" && "opacity-[0.82]",
                )}
              >
                <motion.span
                  aria-hidden
                  className={cn(
                    "absolute left-0 top-1 z-[2] h-3 w-3 rounded-full border-2 border-background dark:border-[rgba(12,12,14,0.96)]",
                    state === "active" &&
                      "border-primary/35 bg-primary shadow-[0_0_14px_rgba(59,184,247,0.85)] dark:border-primary/45",
                    state === "past" &&
                      "border-primary/25 bg-primary/55 shadow-[0_0_8px_rgba(59,184,247,0.28)] dark:bg-primary/45",
                    state === "future" &&
                      "bg-foreground/35 shadow-[0_0_0_1px_rgba(0,0,0,0.06)] dark:bg-white/42 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.12)]",
                  )}
                  animate={
                    reducedMotion
                      ? {}
                      : {
                          scale: state === "active" ? 1.12 : 1,
                        }
                  }
                  transition={{
                    type: "spring",
                    stiffness: 420,
                    damping: 28,
                  }}
                />
                <p className="font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  <time dateTime={entry.start}>{entry.start}</time>
                  <span aria-hidden> — </span>
                  {entry.end === "present" ? (
                    <span>{t("presentLabel")}</span>
                  ) : (
                    <time dateTime={entry.end}>{entry.end}</time>
                  )}
                  {entry.location ? (
                    <>
                      <span aria-hidden> · </span>
                      <span>{entry.location}</span>
                    </>
                  ) : null}
                </p>
                <h3 className="mt-1 text-sm font-bold tracking-tight text-foreground">
                  {entry.role}
                </h3>
                <p className="text-xs font-semibold text-foreground/70">
                  {entry.company}
                </p>

                {entry.highlights.length > 0 ? (
                  <ul className="mt-2 list-none space-y-1 p-0">
                    {entry.highlights.map((h) => (
                      <li
                        key={h}
                        className="flex gap-2 text-xs font-medium leading-relaxed text-foreground/75"
                      >
                        <span
                          aria-hidden
                          className={cn(
                            "mt-1.5 h-1 w-1 shrink-0 rounded-full transition-colors duration-300",
                            state === "future"
                              ? "bg-primary/45"
                              : "bg-primary/70",
                          )}
                        />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {entry.stack && entry.stack.length > 0 ? (
                  <ul className="mt-2 flex list-none flex-wrap gap-1 p-0">
                    {entry.stack.map((s) => (
                      <li
                        key={s}
                        className={cn(
                          "rounded-md border px-1.5 py-0.5 text-[10px] font-semibold transition-colors duration-300",
                          state === "active"
                            ? "border-primary/35 bg-primary/[0.12] text-foreground dark:border-primary/40 dark:bg-primary/[0.14] dark:text-white/90"
                            : "border-border bg-foreground/[0.06] text-foreground/85 dark:border-white/12 dark:bg-white/[0.07] dark:text-white/80",
                        )}
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
