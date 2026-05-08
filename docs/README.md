# yemredev.com — Documentation

This folder is the source of truth for how the **yemredev.com** portfolio is built. All docs are English-only, factual, and codebase-backed.

## Layout

- `global/` — cross-cutting concepts used by multiple parts of the app
- `modules/` — specific app features that have a single owner
- `3rd-party/` — external provider integrations (and pending decisions)
- `phases/` — per-phase implementation log

## Index

### Global

- [Architecture](global/architecture.md) — system overview, request flow, folder map
- [Internationalization](global/i18n.md) — locale detection, message catalogs, navigation helpers
- [Theming](global/theming.md) — `next-themes`, dark default, token system
- [Conventions](global/conventions.md) — RSC/client boundaries, path aliases, file naming
- [Accessibility](global/accessibility.md) — WCAG baseline rules
- [Performance](global/performance.md) — React/Next perf rules
- [CI/CD](global/ci-cd.md) — GitHub Actions workflow

### Modules

- [Routing & Layout](modules/routing-and-layout.md) — `app/` structure, `[locale]` segment, root vs locale layout, `proxy.ts`
- [Content Data Layer](modules/content-data-layer.md) — JSON content, types, server-only loaders
- [Header Navigation](modules/header-navigation.md) — `Header`, `LanguageSwitcher`, `ThemeToggle`
- [API Placeholders](modules/api-placeholders.md) — `/api/chat`, `/api/contact` (501 stubs)

### Third-party (pending decisions)

- [AI Providers](3rd-party/ai-providers.md) — candidates for Phase 6
- [Contact Providers](3rd-party/contact-providers.md) — candidates for Phase 5
- [Hosting](3rd-party/hosting.md) — candidates for production deploy

### Phases

- [Phase 1 — Core Scaffold](phases/phase-1.md) — what shipped on May 9, 2026

## Linking Rules (when editing docs)

- Inside `docs/README.md` (this file): link as `global/<file>.md`, `modules/<file>.md`, `3rd-party/<file>.md`, `phases/<file>.md`.
- Inside `docs/global/*` or `docs/modules/*` or `docs/3rd-party/*` or `docs/phases/*`:
  - Sibling docs: `<file>.md`
  - Other folders: `../<other-folder>/<file>.md`
  - Source code: `../../<top-level-folder>/...` (e.g. `../../app/[locale]/page.tsx`)
- From `docs/README.md` to source code: `../<top-level-folder>/...` (one level up).
- Never use `docs/...` in links inside files under `docs/` — it breaks rendering from this folder.

## Authoring Principles

- Keep docs **short and factual**. Long narratives belong in commit messages or design exploration notes.
- Every endpoint, file, or contract claim must be **verifiable by clicking a code link**.
- Organize by **module / topic**, not by sprints — except `phases/`, which is intentionally a chronological log.
- Do not include local development setup steps; those live in the root [README.md](../README.md).
