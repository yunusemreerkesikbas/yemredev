# Header Navigation

## Purpose

Sticky top bar shown on every locale-scoped page. The site ships **two** header variants because the landing screen and the rest of the app have different chrome:

| Variant | Used on | Highlights |
| --- | --- | --- |
| `LandingHeader` | `/[locale]` (AI assistant landing) | Logo + `⌘K` hint chip + "Skip Intro" CTA + LanguageSwitcher + ThemeToggle. No nav links — the whole screen *is* the nav. |
| `AppHeader` | `/[locale]/home`, `/[locale]/projects`, `/[locale]/contact` | Logo + nav (Home / Projects / Contact) + LanguageSwitcher + ThemeToggle. Standard site header. |

Each header is a **Server Component** that mounts **three** client islands on the landing route (`LanguageSwitcher`, `ThemeToggle`, `SkipIntroTransitionLink`) and **two** on app routes (`LanguageSwitcher`, `ThemeToggle`).

## Source of truth

- Landing header (server): [components/layout/landing-header.tsx](../../components/layout/landing-header.tsx)
- Skip Intro transition (client): [components/layout/skip-intro-transition.tsx](../../components/layout/skip-intro-transition.tsx)
- App header (server): [components/layout/app-header.tsx](../../components/layout/app-header.tsx)
- Language switcher (client): [components/layout/language-switcher.tsx](../../components/layout/language-switcher.tsx)
- Theme toggle (client): [components/layout/theme-toggle.tsx](../../components/layout/theme-toggle.tsx)
- Mounted by: each page renders its own header (no global mount in [app/[locale]/layout.tsx](../../app/[locale]/layout.tsx))
- String catalogs:
  - Shared: `header.*` ([messages/en.json](../../messages/en.json) / [messages/tr.json](../../messages/tr.json))
  - Landing-specific: `landing.header.*`
  - App-specific: `appHeader.*`

## Anatomy

### LandingHeader

```
┌──────────────────────────────────────────────────────────┐
│  [YE] Yemre Dev               [⌘K] [Skip→] [TR EN] [☼/☾]│
│       Frontend Developer                                  │
└──────────────────────────────────────────────────────────┘
```

| Slot | Component | Type | Notes |
| --- | --- | --- | --- |
| Initials box + name + role | `Link` to `/` | server | 32×32 rounded-lg with primary hover glow |
| `⌘K` hint chip | inline `<div>` | server | Decorative; `aria-hidden`, hidden under `md:` |
| Skip CTA | `SkipIntroTransitionLink` | **client** | Locale-aware `Link` to `/home`; primary click runs Motion iris → FAB proxy then `router.push`. Modifier keys preserve default link behavior. `prefers-reduced-motion` → immediate navigation. |
| Language switcher | `LanguageSwitcher` | **client** | `useTransition` + typed `useRouter` |
| Theme toggle | `ThemeToggle` | **client** | CSS-driven Sun/Moon, no React state |

### AppHeader

```
┌──────────────────────────────────────────────────────────┐
│  [YE] Yemre Dev    Home  Projects  Contact   [TR EN] [☼/☾]│
│       Frontend Developer                                  │
└──────────────────────────────────────────────────────────┘
```

Same chrome on the right side; the middle holds nav links from `appHeader.nav.*`. Brand link points to `/home` (the bento dashboard).

## Behavior

### Language switcher

- Renders a segmented `EN | TR` group.
- Each option uses `aria-pressed` to advertise the active locale to assistive tech.
- Clicking a non-active locale wraps `router.replace(pathname, { locale })` in `useTransition`. The button stays disabled (`disabled={isPending}`) during the transition so the user can't double-toggle.
- Pathname comes from the typed `usePathname` in [i18n/navigation.ts](../../i18n/navigation.ts) — the locale prefix is stripped before re-application, so `/tr/projects → /en/projects`.

### Theme toggle

- Renders **both** Sun and Moon icons; the inactive one is hidden via Tailwind's `dark:hidden` / `dark:block` variants. No `useState` is required, which keeps the component compatible with React 19's `react-hooks/set-state-in-effect` rule.
- `onClick` reads `resolvedTheme` from `useTheme()` and flips it.
- `<button>` carries `suppressHydrationWarning` because the rendered icon depends on a class added post-hydration by `next-themes`.
- `aria-label` comes from `header.theme.label` (localized).

## Rules and invariants

- **Each page renders its own header.** Don't mount a global header in the locale layout — the landing and app variants would clash.
- **Both headers receive `profile: Profile` as a prop.** The brand block reads `profile.initials`, `profile.name`, `profile.title`. Don't fetch profile inside the header — keep it pure render.
- **Logo and nav links use the typed `Link`** so locale prefixes follow the user.
- **Localized labels only** — no hard-coded English / Turkish strings inside the components.
- **Touch targets ≥ 44 px** — toggles and segmented buttons use `h-9` (36 px) **with** generous horizontal padding so the hit area exceeds the minimum.
- **Header is sticky** (`relative z-20`, `h-[70px]`, `backdrop-blur`). Pages reserve no extra space; the header occupies its own block in the layout flow.
- **Don't add a fourth control on landing** without re-evaluating mobile layout — the right cluster is already dense.

## Implementation guide

### Adding a nav link to the app header

1. Add `appHeader.nav.<key>` to **both** message catalogs.
2. Add a `<Link>` inside the `<nav>` block of [components/layout/app-header.tsx](../../components/layout/app-header.tsx), using the typed `Link`.
3. Make sure the corresponding route exists under `app/[locale]/<slug>/page.tsx` (otherwise users hit the locale `not-found`).

### Adding a third locale

1. Update [i18n/routing.ts](../../i18n/routing.ts) (`routing.locales`).
2. The language switcher iterates `routing.locales` automatically — no UI change needed.
3. Add the new locale to [global/i18n.md](../global/i18n.md) and add a country / Accept-Language rule in [proxy.ts](../../proxy.ts).
4. Add a new `content/profile.<locale>.json` (with the new `initials` field).

### Replacing the brand mark with a logo

1. Drop the SVG into [public/](../../public/).
2. Replace the initials `<div>` in both header components with `<Image>` from `next/image`. Keep the same `Link` wrapper.
3. Add an `aria-label` on the `<Link>` (via `tHeader("logoAriaLanding")` / `tHeader("logoAriaApp")` — full name plus context; visible mark is the image).

## Gotchas

- **`useRouter().replace(pathname, { locale })` only works with the wrapped router** from [i18n/navigation.ts](../../i18n/navigation.ts). The raw `next/navigation` router doesn't accept `{ locale }`.
- **`useTransition` is essential.** Without it, the button reports as still-active for the entire route transition and feels unresponsive.
- **Mobile nav is intentionally hidden** (`md:flex`) for now. A mobile drawer is a Phase 3 follow-up; until then, the toggles in the top-right are the only mobile chrome.
- **Don't reintroduce the `useEffect` + `useState` mounted gate** in the theme toggle — it's the textbook trigger for the lint rule and not necessary now that visibility is CSS-driven.
- **Profile prop is a Server-only object.** It comes from [lib/data.ts](../../lib/data.ts) (which has `import "server-only"`). Don't add `"use client"` to either header — the profile would have to be serialized over the RSC boundary, costing first-paint bytes.
