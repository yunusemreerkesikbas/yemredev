# AGENTS.md

Conventions for AI coding agents working on **yemredev.com**. Read this fully before making changes. Keep it short, accurate, and updated when patterns change.

> Looking for deeper docs? See [docs/README.md](docs/README.md). Each section below has a more detailed counterpart in `docs/global/` or `docs/modules/`.

## 1. Stack

- **Framework**: Next.js 16 (App Router)
- **Runtime**: React 19 (Server Components first, `"use client"` only where needed)
- **Language**: TypeScript, `strict: true`
- **Styling**: Tailwind CSS v4 (`@theme` tokens in [app/globals.css](app/globals.css))
- **i18n**: [next-intl](https://next-intl.dev) with URL prefix routing (`/tr`, `/en`)
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes), `class` strategy, dark default
- **Icons**: [lucide-react](https://lucide.dev) — never emoji as UI icons
- **Package manager**: npm (lockfile committed)

No backend service. All portfolio content lives in [content/](content/) as JSON.

## 2. Folder Map

| Path | Purpose |
| --- | --- |
| [app/layout.tsx](app/layout.tsx) | Root layout — passthrough only (no `html`/`body` here) |
| [app/[locale]/layout.tsx](app/[locale]/layout.tsx) | Real layout: `<html lang>`, providers, header |
| [app/[locale]/page.tsx](app/[locale]/page.tsx) | Phase 2 — AI Assistant landing |
| [app/[locale]/home/page.tsx](app/[locale]/home/page.tsx) | Phase 3 — single-screen portfolio overview |
| [app/[locale]/portfolio/page.tsx](app/[locale]/portfolio/page.tsx) | Phase 4 — carousel detail |
| [app/[locale]/contact/page.tsx](app/[locale]/contact/page.tsx) | Phase 5 — contact form |
| [app/api/chat/route.ts](app/api/chat/route.ts) | Phase 6 — AI streaming endpoint (currently `501`) |
| [app/api/contact/route.ts](app/api/contact/route.ts) | Phase 5 — contact submission (currently `501`) |
| [components/layout/](components/layout/) | Header, ThemeToggle, LanguageSwitcher |
| [components/providers/](components/providers/) | Client-only context providers |
| [components/ui/](components/ui/) | Primitive UI building blocks (Button, Card, Input — added when needed) |
| [content/](content/) | Per-locale JSON content (`profile.{en,tr}.json`, `projects.{en,tr}.json`) |
| [i18n/](i18n/) | next-intl routing, request config, typed navigation helpers |
| [messages/](messages/) | UI string catalogs (`en.json`, `tr.json`) |
| [lib/data.ts](lib/data.ts) | Server-only data loaders, wrapped in `react.cache` |
| [lib/utils.ts](lib/utils.ts) | `cn()` helper (clsx + tailwind-merge) |
| [proxy.ts](proxy.ts) | Locale detection (cookie → country → Accept-Language → fallback) — Next.js 16 file convention (formerly `middleware.ts`) |
| [types/](types/) | Shared TS types for content shapes |

## 3. Path Aliases

- Use `@/*` everywhere. Configured in [tsconfig.json](tsconfig.json).
- Don't use deep relative paths (`../../../`).

## 4. Internationalization Rules

- **Always** define new strings in **both** [messages/en.json](messages/en.json) and [messages/tr.json](messages/tr.json). Same key tree.
- Server components: `import { getTranslations, setRequestLocale } from "next-intl/server"`. Call `setRequestLocale(locale)` at the top of every page so static rendering keeps working.
- Client components: `import { useTranslations } from "next-intl"`. Wrap navigation with [i18n/navigation.ts](i18n/navigation.ts) (`Link`, `useRouter`, `usePathname`) — never import the raw `next/link` for in-app links.
- New routes go under `app/[locale]/`. Anything else (API, asset routes) stays outside.
- Locale type: `AppLocale` from [i18n/routing.ts](i18n/routing.ts). Validate untrusted strings with `isAppLocale()`.

## 5. Theming Rules

- Dark is the default; light is opt-in via `<ThemeToggle>`.
- Use semantic Tailwind classes (`bg-background`, `text-foreground`, `border-foreground/10`). Avoid raw `bg-zinc-*` / `text-white` in app code — design tokens live in [app/globals.css](app/globals.css).
- Components must look correct in both themes. Test toggle before opening a PR.
- No hardcoded hex colors in components.

## 6. Server / Client Boundaries

Default to Server Components. Add `"use client"` only when you need:
- Hooks (`useState`, `useEffect`, `useTransition`, `useTheme`, etc.)
- Browser APIs (`window`, `localStorage`, event listeners)
- Interactive event handlers

Patterns:
- Read JSON content via [lib/data.ts](lib/data.ts) **only from Server Components**. The `server-only` import enforces this.
- Don't pass non-serializable values (functions, class instances) from Server → Client.
- Lift `"use client"` to leaves; keep page/layout files server.

## 7. Performance Conventions (from `vercel-react-best-practices`)

- **Avoid request waterfalls**. Run independent `await`s with `Promise.all` (see `async-parallel`).
- **Cache server reads**. Wrap module-scope data getters with `react.cache` (see [lib/data.ts](lib/data.ts)) so repeated calls in the same request are deduped.
- **No shared mutable module state in server code** (`server-no-shared-module-state`).
- **Memoize expensive client work**. Use `useMemo`/`memo` for non-trivial derived values; don't memo trivial expressions.
- **Suspense boundaries**: wrap async chunks with `<Suspense>` so the rest of the page streams (`async-suspense-boundaries`).
- **Defer below-the-fold work**: dynamic import heavy widgets (carousel, chart, AI chat) with `next/dynamic`.
- **Hoist regexes / constants** out of render bodies (`js-hoist-regexp`).
- **Keys must be stable** in lists. Never use array index when items can reorder.

## 8. Accessibility & UX Baseline (from `ui-ux-pro-max`)

- Color contrast ≥ 4.5:1 for body text; ≥ 3:1 for large text.
- Keyboard: visible focus ring on every interactive element. Don't remove `:focus-visible` styles.
- Hit targets ≥ 44×44 px on touch.
- Icon-only buttons need `aria-label`.
- Respect `prefers-reduced-motion` (already wired in [app/globals.css](app/globals.css)).
- No emoji as UI icons — use `lucide-react`.

## 9. Adding a Page

1. Create `app/[locale]/<route>/page.tsx`.
2. Top of file: `await params`, then `setRequestLocale(locale)`.
3. Use `await getTranslations("<namespace>")` for strings; add the namespace to **both** message files.
4. If interactive bits exist, isolate them in a sibling `*.client.tsx` and import.
5. Update [components/layout/header.tsx](components/layout/header.tsx) nav if user-facing.

## 10. Adding Content

- Personal facts → [content/profile.{en,tr}.json](content/) (must match [types/profile.ts](types/profile.ts)).
- Projects → [content/projects.{en,tr}.json](content/) (must match [types/project.ts](types/project.ts)).
- Always add the **same `slug`** in both locale files for projects.
- Image assets → [public/](public/), use `next/image`, always specify `width`/`height` or `fill`.

## 11. Quality Gates (must pass before commit)

```bash
npm run lint
npm run typecheck
npm run build
```

CI ([.github/workflows/ci.yml](.github/workflows/ci.yml)) runs the same trio on every push/PR to `main`.

## 12. Phase Roadmap

| Phase | Scope | Status |
| --- | --- | --- |
| 1 | Core scaffold, i18n, theme, docs | **current** |
| 1.5 | Fill [DESIGN.md](DESIGN.md) from user-supplied design example, refine tokens & fonts | pending example |
| 2 | AI Assistant landing UI (input, skip button) | pending |
| 3 | Single-screen portfolio overview (no scroll) | pending |
| 4 | Portfolio detail carousel | pending |
| 5 | Contact form + delivery provider decision | pending |
| 6 | AI provider decision + Vercel AI SDK streaming | pending |

## 13. Decisions Pending

- **AI provider** (Phase 6): OpenAI / Anthropic / Google / Groq. `.env.example` lists all four commented out.
- **Contact delivery** (Phase 5): Resend / Formspree / EmailJS / mailto.
- **Deploy target**: Vercel / DigitalOcean / Cloudflare / self-host. CI runs lint+build only; deploy job will be appended to [.github/workflows/ci.yml](.github/workflows/ci.yml) after the choice.
- **Final visual tokens & font**: blocked on user-supplied design example.

## 14. Don'ts

- Don't add a backend service (Postgres, Express, etc.). Content is static JSON.
- Don't bypass [i18n/navigation.ts](i18n/navigation.ts) for in-app links.
- Don't put data fetching in Client Components — move it up to a Server Component and pass props.
- Don't import server-only modules (`lib/data.ts`) from any `"use client"` file.
- Don't add new fonts before [DESIGN.md](DESIGN.md) is filled.
- Don't commit `.env.local`.
