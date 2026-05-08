# Phase 1 — Core Scaffold

> **Shipped:** May 9, 2026
> **Status:** complete
> **Plan reference:** `.cursor/plans/yemredev_portfolio_phase_1_*.plan.md`

## Goal

Stand up the project skeleton so all subsequent phases (landing, home, portfolio, contact, AI) can ship without re-doing infrastructure work. No final visual identity yet — that arrives in Phase 1.5 once a design example is shared.

## Decisions locked in

| Topic | Decision | Rationale |
| --- | --- | --- |
| i18n library | `next-intl` with `/tr`, `/en` URL prefixes | SEO-friendly, mature App Router support |
| Locale detection | cookie → country header → `Accept-Language` → `en` | Matches "Turkish from TR, English elsewhere" requirement |
| Theme | `next-themes`, dark default, light toggle, `enableSystem=false` | Per spec |
| Icons | `lucide-react` (no emoji) | Consistent vector set, theme-aware |
| Style helper | `clsx` + `tailwind-merge` (`cn()`) | Standard Tailwind composition pattern |
| Package manager | `npm` | Existing lockfile |
| CI | GitHub Actions: `lint` → `typecheck` → `build` on push / PR to `main` | Per spec |

## Decisions deferred

| Topic | Owner doc | Trigger |
| --- | --- | --- |
| AI provider | [../3rd-party/ai-providers.md](../3rd-party/ai-providers.md) | Phase 6 |
| Contact form delivery | [../3rd-party/contact-providers.md](../3rd-party/contact-providers.md) | Phase 5 |
| Production host | [../3rd-party/hosting.md](../3rd-party/hosting.md) | Pre-launch |
| Visual tokens, fonts, palette | [../../DESIGN.md](../../DESIGN.md) | Design example shared (Phase 1.5) |

## Files added or changed

### New

- [proxy.ts](../../proxy.ts)
- [next.config.ts](../../next.config.ts) (replaced)
- [i18n/routing.ts](../../i18n/routing.ts), [i18n/request.ts](../../i18n/request.ts), [i18n/navigation.ts](../../i18n/navigation.ts)
- [messages/en.json](../../messages/en.json), [messages/tr.json](../../messages/tr.json)
- [app/[locale]/layout.tsx](../../app/[locale]/layout.tsx)
- [app/[locale]/page.tsx](../../app/[locale]/page.tsx)
- [app/[locale]/home/page.tsx](../../app/[locale]/home/page.tsx)
- [app/[locale]/portfolio/page.tsx](../../app/[locale]/portfolio/page.tsx)
- [app/[locale]/contact/page.tsx](../../app/[locale]/contact/page.tsx)
- [app/[locale]/not-found.tsx](../../app/[locale]/not-found.tsx)
- [app/api/chat/route.ts](../../app/api/chat/route.ts)
- [app/api/contact/route.ts](../../app/api/contact/route.ts)
- [components/providers/theme-provider.tsx](../../components/providers/theme-provider.tsx)
- [components/layout/header.tsx](../../components/layout/header.tsx)
- [components/layout/theme-toggle.tsx](../../components/layout/theme-toggle.tsx)
- [components/layout/language-switcher.tsx](../../components/layout/language-switcher.tsx)
- [content/profile.en.json](../../content/profile.en.json), [content/profile.tr.json](../../content/profile.tr.json)
- [content/projects.en.json](../../content/projects.en.json), [content/projects.tr.json](../../content/projects.tr.json)
- [types/profile.ts](../../types/profile.ts), [types/project.ts](../../types/project.ts)
- [lib/utils.ts](../../lib/utils.ts), [lib/data.ts](../../lib/data.ts)
- [.env.example](../../.env.example)
- [.github/workflows/ci.yml](../../.github/workflows/ci.yml)
- [AGENTS.md](../../AGENTS.md)
- [README.md](../../README.md) (replaced)
- [DESIGN.md](../../DESIGN.md)

### Replaced

- [app/layout.tsx](../../app/layout.tsx) — now a passthrough; `<html>` / `<body>` moved to the locale layout
- [app/globals.css](../../app/globals.css) — Tailwind v4 `@theme` token sheet (placeholder values), dark default, `prefers-reduced-motion` global guard

### Removed

- `app/page.tsx` (the create-next-app demo page)
- `middleware.ts` (renamed to `proxy.ts` per Next 16 file convention)

### Dependencies added

`next-intl`, `next-themes`, `clsx`, `tailwind-merge`, `lucide-react`. AI and email packages intentionally not installed yet.

## Verification

| Check | Result |
| --- | --- |
| `npm run lint` | green |
| `npm run typecheck` | green |
| `npm run build` | green, no warnings |
| Static prerender | 12 pages generated (`/en`, `/tr` × `/`, `/home`, `/portfolio`, `/contact`) |
| API surface | `/api/chat`, `/api/contact` both serve `501` |
| Proxy | `/` → `302 /<locale>`, locale prefix preserved on subsequent requests |

## Known follow-ups

- **Phase 1.5**: fill [../../DESIGN.md](../../DESIGN.md) with real tokens, then update [../../app/globals.css](../../app/globals.css) and replace the system-font fallback in the locale layout.
- **Mobile nav**: header nav links are hidden under `md` breakpoint. Need a drawer or condensed nav before Phase 3 ships.
- **Carousel library**: pick before Phase 4 (Embla candidate noted in [../../DESIGN.md](../../DESIGN.md)).

## Lint / build deltas worth remembering

- React 19's `react-hooks/set-state-in-effect` rule blocks the classic `useState(false)` + `useEffect(() => setMounted(true))` pattern. The theme toggle uses CSS-driven visibility (`dark:hidden` / `dark:block`) instead.
- Next 16 deprecates `middleware.ts` — file is `proxy.ts` and the export is `proxy`.
- Multiple lockfiles (parent dir's `package-lock.json`) require pinning `turbopack.root` in [next.config.ts](../../next.config.ts).
- After deleting routes, `.next/` must be wiped or `tsc` errors on a stale `validator.ts`.
