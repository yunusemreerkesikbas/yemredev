# Architecture

## What it is / why it exists

`yemredev.com` is a personal portfolio of a frontend developer with four user-facing surfaces and one machine surface:

1. **AI Assistant landing** (`/[locale]`) — a chat front door that answers questions about the developer using a streaming LLM (Phase 6).
2. **Home overview** (`/[locale]/home`) — single-screen, no-scroll summary of education / experience / skills.
3. **Projects carousel** (`/[locale]/projects`) — horizontal snap carousel of project detail slides (Phase 4 shipped). Route renamed from `/portfolio` in Phase 3.
4. **Contact form** (`/[locale]/contact`) — form posting to `/api/contact`.
5. **API surface** (`/api/chat`, `/api/contact`) — Next.js route handlers; currently `501` placeholders.

The app has **no backend service**. All portfolio data is static JSON shipped with the build.

## Source of truth

- Next.js config: [next.config.ts](../../next.config.ts)
- Locale-aware proxy: [proxy.ts](../../proxy.ts)
- Root layout (passthrough): [app/layout.tsx](../../app/layout.tsx)
- Locale layout (`<html>`, providers, header): [app/[locale]/layout.tsx](../../app/[locale]/layout.tsx)
- Tailwind v4 token sheet: [app/globals.css](../../app/globals.css)
- API placeholders: [app/api/chat/route.ts](../../app/api/chat/route.ts), [app/api/contact/route.ts](../../app/api/contact/route.ts)

## Request flow

```mermaid
flowchart LR
    Visitor -->|GET /| Proxy[proxy.ts]
    Visitor -->|GET /tr or /en| Proxy
    Proxy -->|no locale prefix| Detect{Locale<br/>resolver}
    Detect -->|cookie| Cookie[NEXT_LOCALE]
    Detect -->|country header| Country[x-vercel-ip-country / cf-ipcountry]
    Detect -->|accept-language| AL[Accept-Language]
    Detect -->|fallback| EN[en]
    Cookie --> Redirect[302 to /<locale>/...]
    Country --> Redirect
    AL --> Redirect
    EN --> Redirect
    Proxy -->|locale prefix already present| IntlMW[next-intl middleware]
    IntlMW --> RootLayout[app/layout.tsx]
    RootLayout --> LocaleLayout[app/[locale]/layout.tsx]
    LocaleLayout -->|providers| Page[Server Component pages]
    Page -->|read JSON| DataLoader[lib/data.ts<br/>react.cache]
    Page -->|render strings| MsgCatalog[messages/{locale}.json]
```

API requests bypass the proxy via the matcher and hit the route handlers directly.

## Folder map

| Path | Owner | Purpose |
| --- | --- | --- |
| [app/layout.tsx](../../app/layout.tsx) | platform | Root layout — passthrough only |
| [app/[locale]/layout.tsx](../../app/[locale]/layout.tsx) | platform | `<html lang>`, providers, header |
| [app/[locale]/page.tsx](../../app/[locale]/page.tsx) | landing | Phase 2 — AI Assistant landing |
| [app/[locale]/home/page.tsx](../../app/[locale]/home/page.tsx) | home | Phase 3 — single-screen overview |
| [app/[locale]/projects/page.tsx](../../app/[locale]/projects/page.tsx) | projects | Phase 4 — horizontal carousel (shipped) |
| [app/[locale]/contact/page.tsx](../../app/[locale]/contact/page.tsx) | contact | Phase 5 — contact form |
| [app/api/chat/route.ts](../../app/api/chat/route.ts) | landing | Phase 6 — streaming AI endpoint (`501`) |
| [app/api/contact/route.ts](../../app/api/contact/route.ts) | contact | Phase 5 — contact submission (`501`) |
| [components/layout/](../../components/layout/) | platform | Header, ThemeToggle, LanguageSwitcher |
| [components/providers/](../../components/providers/) | platform | Client-only context providers |
| [components/ui/](../../components/ui/) | platform | Primitive UI building blocks |
| [content/](../../content/) | content | Per-locale JSON content |
| [i18n/](../../i18n/) | platform | next-intl routing, request, navigation |
| [messages/](../../messages/) | platform | UI string catalogs |
| [lib/data.ts](../../lib/data.ts) | platform | Server-only data loaders |
| [lib/utils.ts](../../lib/utils.ts) | platform | `cn()` helper |
| [proxy.ts](../../proxy.ts) | platform | Locale detection + redirect |
| [types/](../../types/) | platform | Shared content types |

## Rules and invariants

- **No backend service.** Portfolio data lives in [content/](../../content/) JSON files. If a feature wants persistent state, the design must be revisited.
- **Locale prefix is always present** in URLs. The proxy never serves a non-prefixed page; it redirects.
- **Server Components by default.** `"use client"` is added at the leaf, not at the page or layout level.
- **Static rendering preserved.** Every page calls `setRequestLocale(locale)` so `generateStaticParams` can prerender both locales.

## Common patterns

- Read content from a Server Component → call `getProfile(locale)` or `getProjects(locale)` from [lib/data.ts](../../lib/data.ts). The result is deduped per request via `react.cache`.
- Localize a string → add the same key to **both** [messages/en.json](../../messages/en.json) and [messages/tr.json](../../messages/tr.json), then `getTranslations("namespace")` in a server file or `useTranslations("namespace")` in a client file.
- Navigate inside the app → import `Link` / `useRouter` / `usePathname` from [i18n/navigation.ts](../../i18n/navigation.ts) so locale prefixes stay correct.

## Gotchas

- **Stale `.next` cache after deleting routes** — Next.js generates a `validator.ts` referencing old `app/page.tsx`. Wipe `.next` then rebuild after restructuring routes.
- **`middleware.ts` deprecated in Next 16.** The file is named [proxy.ts](../../proxy.ts) and the export is `proxy`, not `middleware`. Build emits a deprecation warning if reverted.
- **Multiple lockfiles** — a parent-directory `package-lock.json` will hijack the Turbopack root inference. Pinned via `turbopack.root` in [next.config.ts](../../next.config.ts).
