# Contact page (formless)

## Purpose

The **reach-out** surface at `/{locale}/contact`. There is **no HTML form** and no third-party form provider: visitors use **`profile.social`** links (`mailto`, GitHub, LinkedIn, etc.) from [`content/profile.{locale}.json`](../../content/profile.en.json).

## Source of truth

- Page: [`app/[locale]/contact/page.tsx`](../../app/%5Blocale%5D/contact/page.tsx)
- Social icon panel (server): [`components/contact/contact-social-panel.tsx`](../../components/contact/contact-social-panel.tsx)
- Shared social icons: [`lib/social-icons.tsx`](../../lib/social-icons.tsx) (also used by [`components/home/status-block.tsx`](../../components/home/status-block.tsx))
- Mailto display helper: [`lib/mailto-address.ts`](../../lib/mailto-address.ts)
- Copy: `contact.*` in [`messages/en.json`](../../messages/en.json) / [`messages/tr.json`](../../messages/tr.json)
- Visual spec: [DESIGN.md](../../DESIGN.md) §7.4

## Rules

- **No form, no API route for submit.** Email is `mailto:` only; external networks open in a new tab with `rel="noopener noreferrer"`.
- **Single viewport shell** on `lg+` matches Home/Projects: `lg:h-dvh`, **`overflow-hidden`** on the route wrapper; **`main`** is `flex-1 min-h-0`, **`items-center`**, **`overflow-hidden`** — **no page-level scroll**; inner **`my-auto`** keeps the block vertically centered in the area under the header.
- **Layout:** **Centered** header (optional **availability** pill, headline, subtitle). **Contact row:** from **`md:`**, **Email** then **Location** (stacked), **`w-px` vertical hairline** (`bg-white/[0.12]`), then **`ContactSocialPanel`** — row `justify-center`, `items-stretch` so the line spans the block height. Mobile: stack + **`h-px`** hairline between column and social. No boxed border; no `socialPanelSubtitle`.
- **Headline scale:** `text-4xl` → `lg:text-7xl`, `text-balance`, `max-w-4xl` within centered header.
- **Touch targets:** each social control is **48×48** (`h-12 w-12`); full `aria-label` from `social.label`.

## Changing copy or channels

1. Edit `contact.*` strings in the locale JSON message files (including `headlineBefore` / `headlineAccent` / `headlineAfter` for the split title).
2. Add/remove/reorder objects in `profile.social` (same `SocialLink` shape as home).

## Verification

- `npm run lint`, `npm run typecheck`, `npm run build`
- Manual: `/en/contact`, `/tr/contact`; tab through social tiles and the email row; `mailto` opens client; external links open in new tab.
