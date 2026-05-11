/**
 * Shared primary nav targets for app shell (`AppHeader`, mobile drawer, landing drawer).
 * Labels use `useTranslations("appHeader")` + `labelKey`.
 */
export const NAV_LINK_CLASS =
  "inline-flex min-h-11 min-w-[4.5rem] items-center justify-center rounded-lg px-4 text-sm font-semibold tracking-tight transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/55 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export const APP_HEADER_NAV_ITEMS = [
  { href: "/home" as const, labelKey: "nav.home" as const },
  { href: "/projects" as const, labelKey: "nav.projects" as const },
  { href: "/contact" as const, labelKey: "nav.contact" as const },
] as const;

export type AppHeaderNavHref = (typeof APP_HEADER_NAV_ITEMS)[number]["href"];
