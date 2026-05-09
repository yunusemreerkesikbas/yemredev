# Routing & Layout

## Purpose

Defines the App Router shape, the locale-scoped layout, and the proxy that performs locale detection. Owns the contract for "which file becomes which URL" and "where `<html>` / providers live".

## Source of truth

- Proxy + matcher: [proxy.ts](../../proxy.ts)
- Root layout (passthrough): [app/layout.tsx](../../app/layout.tsx)
- Locale layout (`<html>`, providers, header): [app/[locale]/layout.tsx](../../app/[locale]/layout.tsx)
- Page routes:
  - [app/[locale]/page.tsx](../../app/[locale]/page.tsx)
  - [app/[locale]/home/page.tsx](../../app/[locale]/home/page.tsx)
  - [app/[locale]/projects/page.tsx](../../app/[locale]/projects/page.tsx)
  - [app/[locale]/contact/page.tsx](../../app/[locale]/contact/page.tsx) — see [contact-page.md](contact-page.md)
  - [app/[locale]/not-found.tsx](../../app/[locale]/not-found.tsx)

## Routing surface

| URL | File | Phase | Render |
| --- | --- | --- | --- |
| `/` | (proxied) | 1 | 302 redirect to `/<locale>` |
| `/{locale}` | [app/[locale]/page.tsx](../../app/[locale]/page.tsx) | 2 | Static (SSG) |
| `/{locale}/home` | [app/[locale]/home/page.tsx](../../app/[locale]/home/page.tsx) | 3 | Static (SSG) |
| `/{locale}/projects` | [app/[locale]/projects/page.tsx](../../app/[locale]/projects/page.tsx) | 4 | Static (SSG) — carousel shipped |
| `/{locale}/contact` | [app/[locale]/contact/page.tsx](../../app/[locale]/contact/page.tsx) | 5 | Static (SSG) — formless social cards |
| `/api/chat` | [app/api/chat/route.ts](../../app/api/chat/route.ts) | 6 | Dynamic (`runtime = "edge"`) |
| `/api/contact` | [app/api/contact/route.ts](../../app/api/contact/route.ts) | 5 | Dynamic (Node) |

`{locale}` ∈ `{en, tr}`, fixed by [i18n/routing.ts](../../i18n/routing.ts) and prerendered via `generateStaticParams` in the locale layout.

## Layout topology

```mermaid
flowchart TB
    Root[app/layout.tsx<br/>passthrough] --> Locale[app/[locale]/layout.tsx]
    Locale -->|html lang| HTML[html with suppressHydrationWarning]
    Locale -->|providers| NextIntl[NextIntlClientProvider]
    NextIntl --> Theme[ThemeProvider<br/>defaultTheme=dark<br/>enableSystem=false]
    Theme --> Header[Header]
    Theme --> Main[main fills viewport]
    Main --> Page[Page Server Component]
```

The **root** layout intentionally renders nothing but `children` so the locale layout can own `<html>` and `<body>` with a proper `lang` attribute. This pattern is the canonical next-intl recipe and is required for static rendering both locales.

## Proxy contract

[proxy.ts](../../proxy.ts) is the Next 16 file convention (formerly `middleware.ts`). It:

1. Matches every path except `/api/*`, `/_next/*`, `/_vercel/*`, and any path containing a dot (assets).
2. If the path **already** carries a locale prefix → delegates to next-intl's middleware untouched.
3. Otherwise resolves the locale via `cookie → country header → Accept-Language → en`, sets the `NEXT_LOCALE` cookie (1-year), and 302-redirects to `/{locale}{originalPath}`.

See [global/i18n.md](../global/i18n.md) for the full resolution table.

## Rules and invariants

- **`html` and `body` live in the locale layout, not the root.** Don't move them back.
- **Every server page calls `setRequestLocale(locale)`** at the top, after `await params`, or static rendering breaks.
- **Validate `params.locale`** with `hasLocale(routing.locales, locale)` before `setRequestLocale`. Invalid → `notFound()`.
- **`generateStaticParams`** lives only in the locale layout. Sub-pages inherit it.
- **Root `not-found.tsx` is intentionally absent.** The locale `not-found.tsx` is reachable through normal navigation; non-locale 404s are redirected by the proxy first.

## Implementation guide

### Adding a new locale-scoped page

1. Create `app/[locale]/<slug>/page.tsx`.
2. Top of the file:

   ```ts
   const { locale } = await params;
   setRequestLocale(locale);
   const t = await getTranslations("<namespace>");
   ```

3. Add `<namespace>` to **both** [messages/en.json](../../messages/en.json) and [messages/tr.json](../../messages/tr.json).
4. Add a nav link in [components/layout/header.tsx](../../components/layout/header.tsx) using the typed `Link` from [i18n/navigation.ts](../../i18n/navigation.ts).

### Adding a non-localized API route

1. Create `app/api/<slug>/route.ts`.
2. Export `GET` / `POST` etc. as needed.
3. Choose `runtime = "edge"` for streaming, default Node otherwise.
4. The proxy matcher already excludes `/api/*` — no further config required.

### Removing a route

1. Delete the file.
2. Wipe `.next/` before re-running `tsc` — Next 16 keeps a stale `validator.ts` referencing the removed module otherwise.

## Gotchas

- **Stale `.next/` after route deletion.** Symptom: `tsc` fails with `Cannot find module '../../app/page.js'`. Fix: `rm -rf .next` or PowerShell `Remove-Item -Recurse -Force .next`.
- **Edge runtime disables ISR for that route.** `/api/chat` shows up as `ƒ` in the build summary, which is expected.
- **`/` is never a final URL.** All in-app links must use the typed `Link` so the locale prefix is added.
- **`params` is a Promise** in Next 16 — always `await params` before reading.
