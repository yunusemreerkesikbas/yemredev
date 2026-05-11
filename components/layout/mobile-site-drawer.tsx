"use client";

import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { Link, usePathname } from "@/i18n/navigation";
import {
  APP_HEADER_NAV_ITEMS,
  NAV_LINK_CLASS,
} from "@/components/layout/app-header-links";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { cn } from "@/lib/utils";

const DRAWER_LINK_CLASS = cn(
  NAV_LINK_CLASS,
  "w-full min-w-0 justify-start px-4 sm:px-5",
);

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const EASE_IN = [0.4, 0, 1, 1] as const;

/**
 * Full-height mobile drawer (viewport &lt; `md`): primary nav, language, theme.
 * Rendered via `createPortal` to `document.body` for correct `fixed` stacking.
 * Desktop: trigger hidden (`md:hidden`); controls live in headers at `md+`.
 * Open/close: backdrop fade + panel slide; honors `prefers-reduced-motion`.
 */
export function MobileSiteDrawer() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("appHeader");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const bodyOverflowRef = useRef<string>("");
  const reduceMotion = useReducedMotion();

  const instant = reduceMotion === true;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const lockBody = useCallback(() => {
    bodyOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }, []);

  const unlockBody = useCallback(() => {
    document.body.style.overflow = bodyOverflowRef.current;
  }, []);

  useEffect(() => {
    if (open) lockBody();
  }, [open, lockBody]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = bodyOverflowRef.current;
    };
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => {
      const panel = panelRef.current;
      if (!panel) return;
      const first = panel.querySelector<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      first?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(id);
  }, [open]);

  const onExitComplete = useCallback(() => {
    unlockBody();
    queueMicrotask(() => triggerRef.current?.focus());
  }, [unlockBody]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const close = () => setOpen(false);
  const toggle = () => setOpen((v) => !v);

  const backdropTransition = instant
    ? { duration: 0 }
    : { duration: 0.22, ease: EASE_OUT };

  const panelTransition = instant
    ? { duration: 0 }
    : { duration: 0.32, ease: EASE_OUT };

  const panelExitTransition = instant
    ? { duration: 0 }
    : { duration: 0.24, ease: EASE_IN };

  const drawerContent = (
    <AnimatePresence onExitComplete={onExitComplete}>
      {open ? (
        <motion.div
          key="mobile-site-drawer"
          role="presentation"
          className="fixed inset-0 z-[70] md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={backdropTransition}
        >
          <button
            type="button"
            aria-label={t("menu.close")}
            onClick={close}
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
          />
          <motion.div
            ref={panelRef}
            id="mobile-site-drawer-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-site-drawer-title"
            className="absolute inset-y-0 right-0 flex max-h-dvh min-h-0 w-[min(100vw-0.75rem,20rem)] flex-col overflow-y-auto overflow-x-hidden border-l border-border bg-background/95 py-4 pl-4 pr-[max(1rem,env(safe-area-inset-right))] shadow-[0_0_0_1px_rgba(0,0,0,0.06)] backdrop-blur-xl dark:bg-background-dark/95 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.06)]"
            initial={instant ? false : { x: "100%" }}
            animate={{ x: 0 }}
            transition={panelTransition}
            exit={
              instant
                ? { x: 0, transition: { duration: 0 } }
                : { x: "100%", transition: panelExitTransition }
            }
          >
            <div className="flex items-center justify-between gap-3 border-b border-border pb-4 pr-1 dark:border-white/10">
              <h2
                id="mobile-site-drawer-title"
                className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground"
              >
                {t("menu.title")}
              </h2>
              <button
                type="button"
                onClick={close}
                aria-label={t("menu.close")}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-foreground transition-colors hover:bg-foreground/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:border-foreground/15 dark:bg-foreground/[0.06] dark:hover:bg-foreground/10"
              >
                <X aria-hidden className="h-5 w-5" strokeWidth={2} />
              </button>
            </div>

            <motion.nav
              aria-label={t("nav.label")}
              className="flex flex-col gap-1 py-5"
              initial={instant ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={
                instant
                  ? { duration: 0 }
                  : { duration: 0.26, ease: EASE_OUT, delay: 0.04 }
              }
            >
              {APP_HEADER_NAV_ITEMS.map(({ href, labelKey }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={close}
                    className={cn(
                      DRAWER_LINK_CLASS,
                      active
                        ? "text-foreground underline decoration-primary/70 underline-offset-[10px] dark:text-white"
                        : "text-muted-foreground hover:text-foreground dark:text-white/60 dark:hover:text-white",
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    {t(labelKey)}
                  </Link>
                );
              })}
            </motion.nav>

            <motion.div
              className="mt-auto flex flex-col gap-4 border-t border-border pt-5 dark:border-white/10"
              initial={instant ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={
                instant
                  ? { duration: 0 }
                  : { duration: 0.26, ease: EASE_OUT, delay: 0.08 }
              }
            >
              <LanguageSwitcher className="h-auto w-full min-w-0 justify-stretch [&>button]:min-h-11 [&>button]:flex-1" />
              <div className="flex justify-end">
                <ThemeToggle />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-foreground shadow-sm transition-colors hover:bg-foreground/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background md:hidden dark:border-foreground/15 dark:bg-foreground/[0.06] dark:hover:bg-foreground/10 dark:shadow-none"
        aria-expanded={open}
        aria-controls="mobile-site-drawer-panel"
        aria-haspopup="dialog"
        aria-label={open ? t("menu.close") : t("menu.open")}
        onClick={toggle}
      >
        <span className="relative flex h-5 w-5 items-center justify-center">
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span
                key="icon-close"
                className="absolute inset-0 flex items-center justify-center"
                initial={instant ? false : { opacity: 0, scale: 0.82, rotate: -45 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={instant ? undefined : { opacity: 0, scale: 0.82, rotate: 45 }}
                transition={
                  instant
                    ? { duration: 0 }
                    : { duration: 0.2, ease: EASE_OUT }
                }
              >
                <X aria-hidden className="h-5 w-5" strokeWidth={2} />
              </motion.span>
            ) : (
              <motion.span
                key="icon-open"
                className="absolute inset-0 flex items-center justify-center"
                initial={instant ? false : { opacity: 0, scale: 0.82 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={instant ? undefined : { opacity: 0, scale: 0.82 }}
                transition={
                  instant
                    ? { duration: 0 }
                    : { duration: 0.2, ease: EASE_OUT }
                }
              >
                <Menu aria-hidden className="h-5 w-5" strokeWidth={2} />
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </button>
      {mounted ? createPortal(drawerContent, document.body) : null}
    </>
  );
}
