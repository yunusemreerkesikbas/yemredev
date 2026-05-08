# yemredev.com

Personal portfolio of **Yemre Dev** — a frontend developer site with an AI assistant front door, single-screen overview, project carousel, and contact form. Multi-language (TR / EN), dark by default.

> Status: **Phase 1 — Core scaffold complete**. UI is intentionally minimal until the design example arrives and `DESIGN.md` is filled in.

## Tech Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript** (strict)
- **Tailwind CSS v4** with `@theme` tokens
- **next-intl** (`/tr`, `/en` URL prefixes) + cookie/country/Accept-Language detection
- **next-themes** (dark default, light toggle)
- **lucide-react** for icons
- Static JSON content in [`content/`](content/) — no backend service

## Getting Started

```bash
npm install
cp .env.example .env.local   # only needed for Phase 5 (contact) and Phase 6 (AI)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The middleware redirects `/` to `/en` or `/tr` based on (in order): `NEXT_LOCALE` cookie → `x-vercel-ip-country` / `cf-ipcountry` header → `Accept-Language` header → `en`.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Next dev server with Turbopack |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | ESLint via `eslint-config-next` |
| `npm run typecheck` | `tsc --noEmit` |

CI ([.github/workflows/ci.yml](.github/workflows/ci.yml)) runs `lint` → `typecheck` → `build` on push and pull requests targeting `master`.

## Project Layout

```
app/
  layout.tsx                  # passthrough root (no html/body)
  globals.css                 # Tailwind v4 @theme tokens (placeholder)
  [locale]/
    layout.tsx                # html, body, NextIntlProvider, ThemeProvider, Header
    page.tsx                  # Phase 2 — AI Assistant landing
    home/page.tsx             # Phase 3
    portfolio/page.tsx        # Phase 4
    contact/page.tsx          # Phase 5
    not-found.tsx
  api/
    chat/route.ts             # Phase 6 — currently 501
    contact/route.ts          # Phase 5 — currently 501
components/
  layout/                     # Header, ThemeToggle, LanguageSwitcher
  providers/                  # ThemeProvider client wrapper
  ui/                         # primitives — added when needed
content/                      # per-locale JSON content
i18n/                         # routing, request config, typed nav helpers
messages/                     # UI string catalogs (en.json, tr.json)
lib/                          # data loaders, utilities
types/                        # shared content types
proxy.ts                      # locale detection + redirect (Next 16 file convention)
```

Full conventions live in [AGENTS.md](AGENTS.md). Design tokens / typography / motion live in [DESIGN.md](DESIGN.md) (skeleton — pending example). Per-feature and per-topic documentation lives under [docs/](docs/README.md).

## Internationalization

- Add new strings to **both** [messages/en.json](messages/en.json) and [messages/tr.json](messages/tr.json) at the same key path.
- Server: `getTranslations(...)` + `setRequestLocale(locale)` at the top of pages.
- Client: `useTranslations(...)`.
- Navigation: import `Link` / `useRouter` / `usePathname` from [`@/i18n/navigation`](i18n/navigation.ts) — never raw `next/link` for in-app routes.

## Theming

- `dark` is the default class on `<html>`. `<ThemeToggle>` flips between `dark` and `light`.
- Use semantic Tailwind classes only: `bg-background`, `text-foreground`, `border-foreground/10`. Token values live in [app/globals.css](app/globals.css).

## Documentation

| Doc | Purpose |
| --- | --- |
| [docs/README.md](docs/README.md) | Documentation index — start here |
| [docs/global/](docs/global/) | Cross-cutting concepts (architecture, i18n, theming, conventions, accessibility, performance, CI/CD) |
| [docs/modules/](docs/modules/) | Per-feature owner docs (routing & layout, content data layer, header navigation, API placeholders) |
| [docs/3rd-party/](docs/3rd-party/) | External provider candidates (AI, contact, hosting) — pending decisions |
| [docs/phases/](docs/phases/) | Per-phase implementation log |

## Phase Roadmap

| Phase | Scope |
| --- | --- |
| 1 (current) | Core scaffold, i18n, theme, docs |
| 1.5 | Fill `DESIGN.md` from user-supplied design example, refine tokens & fonts |
| 2 | AI Assistant landing UI (with `Skip portfolio` button) |
| 3 | Single-screen portfolio overview (no scroll) |
| 4 | Portfolio detail carousel |
| 5 | Contact form + email provider integration |
| 6 | AI provider integration (Vercel AI SDK streaming) |

## Pending Decisions

- **AI provider** (Phase 6): OpenAI / Anthropic / Google / Groq
- **Contact delivery** (Phase 5): Resend / Formspree / EmailJS / mailto
- **Deploy target**: Vercel / DigitalOcean / Cloudflare / self-host — CI is provider-agnostic for now

## Deployment

> **TBD.** A `deploy` job will be appended to [.github/workflows/ci.yml](.github/workflows/ci.yml) once the hosting target is chosen.

The site has no infrastructure dependencies — any Next.js-compatible host works (Vercel, Cloudflare Pages, DigitalOcean App Platform, self-hosted Node / Docker).

## License

Private. All rights reserved.
