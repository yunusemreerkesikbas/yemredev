"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type { KeyboardEvent } from "react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export type MediaSlide = { src: string; alt: string };

type ProjectMediaCarouselProps = {
  slides: MediaSlide[];
  previewLabel: string;
};

/**
 * In-card horizontal gallery: root-relative images only, snap + arrows + dots.
 * Nested under the projects carousel; uses overscroll-x-contain to reduce gesture bleed.
 */
export function ProjectMediaCarousel({
  slides,
  previewLabel,
}: ProjectMediaCarouselProps) {
  const t = useTranslations("projects.media");
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const rafRef = useRef<number | null>(null);

  const total = slides.length;

  const syncActiveFromScroll = useCallback(() => {
    const root = scrollerRef.current;
    if (!root || root.children.length === 0) return;

    const rootRect = root.getBoundingClientRect();
    let bestI = 0;
    let bestOverlap = 0;

    for (let i = 0; i < root.children.length; i++) {
      const el = root.children[i] as HTMLElement;
      const r = el.getBoundingClientRect();
      const left = Math.max(r.left, rootRect.left);
      const right = Math.min(r.right, rootRect.right);
      const overlap = Math.max(0, right - left);
      if (overlap > bestOverlap) {
        bestOverlap = overlap;
        bestI = i;
      }
    }

    setActiveIndex((prev) => (prev === bestI ? prev : bestI));
  }, []);

  const scheduleSync = useCallback(() => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      syncActiveFromScroll();
    });
  }, [syncActiveFromScroll]);

  useEffect(() => {
    const root = scrollerRef.current;
    if (!root || total <= 1) return;

    const onScroll = () => scheduleSync();
    root.addEventListener("scroll", onScroll, { passive: true });
    root.addEventListener("scrollend", onScroll as EventListener);
    syncActiveFromScroll();

    return () => {
      root.removeEventListener("scroll", onScroll);
      root.removeEventListener("scrollend", onScroll as EventListener);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [scheduleSync, syncActiveFromScroll, total]);

  const goTo = useCallback(
    (index: number) => {
      const root = scrollerRef.current;
      if (!root || total === 0) return;
      const clamped = Math.max(0, Math.min(total - 1, index));
      const child = root.children[clamped] as HTMLElement | undefined;
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      child?.scrollIntoView({
        behavior: reduced ? "auto" : "smooth",
        inline: "start",
        block: "nearest",
      });
    },
    [total],
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (total <= 1) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        e.stopPropagation();
        goTo(activeIndex - 1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        e.stopPropagation();
        goTo(activeIndex + 1);
      }
    },
    [activeIndex, goTo, total],
  );

  if (total === 0) {
    return (
      <div
        role="img"
        aria-label={previewLabel}
        className="relative flex aspect-[3/2] w-full flex-col overflow-hidden rounded-xl border border-white/12 bg-gradient-to-br from-zinc-950/90 via-zinc-950/70 to-black/85 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] lg:aspect-[4/3]"
      >
        <div className="flex items-center gap-1.5 border-b border-white/10 pb-3">
          <span aria-hidden className="h-2 w-2 rounded-full bg-white/25" />
          <span aria-hidden className="h-2 w-2 rounded-full bg-white/25" />
          <span aria-hidden className="h-2 w-2 rounded-full bg-white/25" />
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
          <Sparkles
            aria-hidden
            className="h-10 w-10 text-primary/70 motion-safe:animate-pulse-slow motion-reduce:animate-none"
            strokeWidth={1.5}
          />
          <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-foreground/45">
            {previewLabel}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div className="relative aspect-[3/2] w-full overflow-hidden rounded-xl border border-white/12 bg-black/40 shadow-inner lg:aspect-[4/3]">
        <div
          ref={scrollerRef}
          tabIndex={total > 1 ? 0 : undefined}
          role="region"
          aria-label={t("trackLabel")}
          onKeyDown={onKeyDown}
          className={cn(
            "no-scrollbar-webkit no-scrollbar absolute inset-0 flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth touch-pan-x",
          )}
          style={{ scrollSnapType: "x mandatory" }}
        >
          {slides.map((slide, index) => (
            <div
              key={`${slide.src}-${index}`}
              className="relative h-full min-w-full shrink-0 snap-start"
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 40vw, 85vw"
                priority={false}
              />
            </div>
          ))}
        </div>

        {total > 1 ? (
          <>
            <button
              type="button"
              onClick={() => goTo(activeIndex - 1)}
              disabled={activeIndex <= 0}
              aria-label={t("prev")}
              className={cn(
                "glass-card absolute left-2 top-1/2 z-10 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-foreground/90 dark:text-white/90",
                "transition-[transform,border-color,background-color,opacity] duration-200 ease-out",
                "hover:border-primary/45 hover:bg-white/[0.1]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
                "disabled:pointer-events-none disabled:opacity-35",
              )}
            >
              <ChevronLeft className="h-4 w-4" aria-hidden strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={() => goTo(activeIndex + 1)}
              disabled={activeIndex >= total - 1}
              aria-label={t("next")}
              className={cn(
                "glass-card absolute right-2 top-1/2 z-10 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-foreground/90 dark:text-white/90",
                "transition-[transform,border-color,background-color,opacity] duration-200 ease-out",
                "hover:border-primary/45 hover:bg-white/[0.1]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
                "disabled:pointer-events-none disabled:opacity-35",
              )}
            >
              <ChevronRight className="h-4 w-4" aria-hidden strokeWidth={2} />
            </button>
          </>
        ) : null}
      </div>

      {total > 1 ? (
        <>
          <p className="sr-only" aria-live="polite">
            {t("slideStatus", { current: activeIndex + 1, total })}
          </p>
          <div
            className="mt-2 flex justify-center gap-1"
            role="tablist"
            aria-label={t("dotsLabel")}
          >
            {slides.map((_, i) => (
              <button
                key={`media-dot-${i}`}
                type="button"
                role="tab"
                aria-selected={i === activeIndex}
                aria-label={t("goToSlide", { index: i + 1 })}
                onClick={() => goTo(i)}
                className="group/mdot inline-flex min-h-9 min-w-9 cursor-pointer items-center justify-center rounded-full p-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              >
                <span
                  className={cn(
                    "block rounded-full transition-[width,background-color] duration-200 ease-out",
                    i === activeIndex
                      ? "h-1 w-6 bg-primary"
                      : "h-1 w-1.5 bg-white/35 group-hover/mdot:bg-white/55",
                  )}
                />
              </button>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
