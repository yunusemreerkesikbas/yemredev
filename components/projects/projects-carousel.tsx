"use client";

import {
  Children,
  isValidElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type ProjectsCarouselProps = {
  title: string;
  subtitle?: string;
  /** Stable keys for slide wrappers (e.g. project slugs from the server page). */
  slideIds: string[];
  children: ReactNode;
  className?: string;
};

/**
 * Horizontal snap carousel for `/projects`. Wraps each child in a wide snap
 * target (~90vw, capped). Prev/next use DESIGN.md glass-card arrows; dots match
 * the frozen inactive/active sizes. Active index syncs via `scroll` (rAF
 * throttled) + `scrollend` when available.
 */
export function ProjectsCarousel({
  title,
  subtitle,
  slideIds,
  children,
  className,
}: ProjectsCarouselProps) {
  const t = useTranslations("projects.carousel");
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const rafRef = useRef<number | null>(null);

  const items = Children.toArray(children).filter(isValidElement);
  const total = items.length;

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
    if (!root) return;

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
      if (!root) return;
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

  const onPrev = useCallback(() => {
    goTo(activeIndex - 1);
  }, [activeIndex, goTo]);

  const onNext = useCallback(() => {
    goTo(activeIndex + 1);
  }, [activeIndex, goTo]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        onPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        onNext();
      }
    },
    [onNext, onPrev],
  );

  if (total === 0) {
    return null;
  }

  return (
    <section
      aria-roledescription="carousel"
      aria-label={title}
      className={cn(
        "mx-auto flex w-full max-w-[min(100%,92rem)] max-lg:shrink-0 flex-col px-3 pt-2 pb-8 sm:px-5 md:px-8 lg:min-h-0 lg:flex-1 lg:pb-4",
        className,
      )}
    >
      <div className="mb-4 flex shrink-0 flex-col gap-3 sm:mb-5 sm:flex-row sm:items-end sm:justify-between lg:mb-4">
        <div>
          <h1 className="text-gradient-fade text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-1 max-w-2xl text-sm font-medium text-foreground/72 sm:text-base">
              {subtitle}
            </p>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={onPrev}
            disabled={activeIndex <= 0}
            aria-label={t("prev")}
            className={cn(
              "group/prev glass-card relative inline-flex size-11 min-h-11 min-w-11 items-center justify-center overflow-hidden rounded-full text-foreground/90 dark:text-white/90",
              "transition-[transform,box-shadow,background-color,border-color,opacity] duration-200 ease-out",
              "hover:-translate-y-0.5 hover:border-primary/40 hover:bg-white/[0.08] hover:shadow-[0_10px_36px_-10px_rgba(59,184,247,0.35)]",
              "active:translate-y-0 active:scale-[0.97]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
              "disabled:pointer-events-none disabled:opacity-35 disabled:hover:translate-y-0 disabled:hover:shadow-none",
            )}
          >
            <ChevronLeft
              aria-hidden
              className="relative z-10 h-5 w-5 transition-transform duration-200 ease-out group-hover/prev:-translate-x-0.5 motion-reduce:group-hover/prev:translate-x-0"
              strokeWidth={2}
            />
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={activeIndex >= total - 1}
            aria-label={t("next")}
            className={cn(
              "group/next glass-card relative inline-flex size-11 min-h-11 min-w-11 items-center justify-center overflow-hidden rounded-full text-foreground/90 dark:text-white/90",
              "transition-[transform,box-shadow,background-color,border-color,opacity] duration-200 ease-out",
              "hover:-translate-y-0.5 hover:border-primary/40 hover:bg-white/[0.08] hover:shadow-[0_10px_36px_-10px_rgba(59,184,247,0.35)]",
              "active:translate-y-0 active:scale-[0.97]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
              "disabled:pointer-events-none disabled:opacity-35 disabled:hover:translate-y-0 disabled:hover:shadow-none",
            )}
          >
            <ChevronRight
              aria-hidden
              className="relative z-10 h-5 w-5 transition-transform duration-200 ease-out group-hover/next:translate-x-0.5 motion-reduce:group-hover/next:translate-x-0"
              strokeWidth={2}
            />
          </button>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {t("slideStatus", { current: activeIndex + 1, total })}
      </p>

      <div
        ref={scrollerRef}
        tabIndex={0}
        role="region"
        aria-label={t("trackLabel")}
        onKeyDown={onKeyDown}
        className={cn(
          "no-scrollbar-webkit no-scrollbar flex h-[clamp(26rem,min(66dvh,48rem),52rem)] touch-pan-x items-stretch gap-7 overflow-x-auto overflow-y-hidden scroll-smooth pb-2",
          "snap-x snap-mandatory scroll-pl-3 sm:scroll-pl-6 md:scroll-pl-8",
          "lg:h-full lg:min-h-0 lg:flex-1",
        )}
        style={{ scrollSnapType: "x mandatory" }}
      >
        {items.map((child, index) => (
          <div
            key={slideIds[index] ?? `slide-${index}`}
            className={cn(
              "flex h-full min-h-0 w-[min(90vw,72rem)] shrink-0 snap-start motion-safe:animate-fade-in",
            )}
            style={{
              animationDelay: `${Math.min(index, 8) * 70}ms`,
            }}
          >
            <div className="flex h-full min-h-0 w-full min-w-0 flex-col">
              {child}
            </div>
          </div>
        ))}
      </div>

      <div
        className="mt-4 flex shrink-0 justify-center gap-2 lg:mt-3"
        role="tablist"
        aria-label={t("dotsLabel")}
      >
        {items.map((_, i) => (
          <button
            key={slideIds[i] ?? `dot-${i}`}
            type="button"
            role="tab"
            aria-selected={i === activeIndex}
            aria-label={t("goToSlide", { index: i + 1 })}
            onClick={() => goTo(i)}
            className="group/dot inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-full p-2 transition-transform duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 motion-reduce:transition-none"
          >
            <span
              className={cn(
                "block rounded-full transition-[width,transform,box-shadow,background-color] duration-300 ease-out motion-reduce:transition-none",
                i === activeIndex
                  ? "h-1 w-8 bg-primary shadow-[0_0_14px_rgba(59,184,247,0.55)]"
                  : "h-1 w-1.5 bg-white/35 group-hover/dot:bg-white/60 group-hover/dot:shadow-[0_0_8px_rgba(255,255,255,0.12)]",
              )}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
