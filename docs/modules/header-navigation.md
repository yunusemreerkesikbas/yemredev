# Header Navigation

## Purpose

Persistent top bar shown on every locale-scoped page. Hosts the brand mark, primary navigation (Home / Portfolio / Contact), language toggle, and theme toggle. The header itself is a **Server Component** that contains two **Client Component** islands.

## Source of truth

- Header (server): [components/layout/header.tsx](../../components/layout/header.tsx)
- Language switcher (client): [components/layout/language-switcher.tsx](../../components/layout/language-switcher.tsx)
- Theme toggle (client): [components/layout/theme-toggle.tsx](../../components/layout/theme-toggle.tsx)
- Mounted by: [app/[locale]/layout.tsx](../../app/[locale]/layout.tsx)
- String catalog: `header.*` keys in [messages/en.json](../../messages/en.json) / [messages/tr.json](../../messages/tr.json)

## Anatomy

```
┌──────────────────────────────────────────────────────────┐
│  yemre.dev    Home  Portfolio  Contact      [TR EN] [☼/☾]│
└──────────────────────────────────────────────────────────┘
```

| Slot | Component | Type | Notes |
| --- | --- | --- | --- |
| Brand link | `Link` from [i18n/navigation.ts](../../i18n/navigation.ts) | server | Always points to `/{locale}` |
| Nav links | `Link` from [i18n/navigation.ts](../../i18n/navigation.ts) | server | Hidden on mobile (`md:flex`) |
| Language switcher | `LanguageSwitcher` | **client** | `useTransition` + `useRouter().replace()` |
| Theme toggle | `ThemeToggle` | **client** | CSS-driven Sun/Moon, no React state |

## Behavior

### Language switcher

- Renders a segmented `EN | TR` group.
- Each option uses `aria-pressed` to advertise the active locale to assistive tech.
- Clicking a non-active locale wraps `router.replace(pathname, { locale })` in `useTransition`. The button stays disabled (`disabled={isPending}`) during the transition so the user can't double-toggle.
- Pathname comes from the typed `usePathname` in [i18n/navigation.ts](../../i18n/navigation.ts) — the locale prefix is stripped before re-application, so `/tr/portfolio → /en/portfolio`.

### Theme toggle

- Renders **both** Sun and Moon icons; the inactive one is hidden via Tailwind's `dark:hidden` / `dark:block` variants. No `useState` is required, which keeps the component compatible with React 19's `react-hooks/set-state-in-effect` rule.
- `onClick` reads `resolvedTheme` from `useTheme()` and flips it.
- `<button>` carries `suppressHydrationWarning` because the rendered icon depends on a class added post-hydration by `next-themes`.
- `aria-label` comes from `header.theme.label` (localized).

## Rules and invariants

- **Logo and nav links use the typed `Link`** so locale prefixes follow the user.
- **Localized labels only** — no hard-coded English / Turkish strings inside the components.
- **Touch targets ≥ 44 px** — the toggle and segmented buttons use `h-9` (36 px) **with** generous horizontal padding so the hit area exceeds the minimum.
- **Header is sticky** (`sticky top-0 z-40 backdrop-blur`). Pages must reserve no extra space; the header occupies its own block in the layout flow.
- **Don't add a fourth control** without re-evaluating mobile layout — there's no overflow menu yet.

## Implementation guide

### Adding a nav link

1. Add `header.nav.<key>` to **both** message catalogs.
2. Add a `<Link>` inside the `<nav>` block of [components/layout/header.tsx](../../components/layout/header.tsx), using the typed `Link`.
3. Make sure the corresponding route exists under `app/[locale]/<slug>/page.tsx` (otherwise users hit the locale `not-found`).

### Adding a third locale

1. Update [i18n/routing.ts](../../i18n/routing.ts) (`routing.locales`).
2. The language switcher iterates `routing.locales` automatically — no UI change needed.
3. Add the new locale to [global/i18n.md](../global/i18n.md) and add a country / Accept-Language rule in [proxy.ts](../../proxy.ts).

### Replacing the brand mark with a logo

1. Drop the SVG into [public/](../../public/).
2. Replace the `<Link>` text content in [components/layout/header.tsx](../../components/layout/header.tsx) with `<Image>` from `next/image`. Keep the same `Link` component.
3. Add an `aria-label` on the `<Link>` so screen readers announce the brand.

## Gotchas

- **`useRouter().replace(pathname, { locale })` only works with the wrapped router** from [i18n/navigation.ts](../../i18n/navigation.ts). The raw `next/navigation` router doesn't accept `{ locale }`.
- **`useTransition` is essential.** Without it, the button reports as still-active for the entire route transition and feels unresponsive.
- **Mobile nav is intentionally hidden** (`md:flex`) for now. A mobile drawer is a Phase 3 follow-up; until then, the toggles in the top-right are the only mobile chrome.
- **Don't reintroduce the `useEffect` + `useState` mounted gate** in the theme toggle — it's the textbook trigger for the lint rule and not necessary now that visibility is CSS-driven.
