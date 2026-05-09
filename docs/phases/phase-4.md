# Phase 4 — Projects carousel

> **Status:** Shipped. `/{locale}/projects` renders a horizontal snap carousel with server-rendered detail slides, a client `ProjectsCarousel` for the outer track, and a nested client `ProjectMediaCarousel` per slide for `cover` + `gallery` screenshots. At `lg+` the page matches Home single-viewport rules (`lg:h-dvh`, `overflow-hidden`).

## Locked-in decisions

| Topic | Decision | Why |
| --- | --- | --- |
| Carousel library | **Native CSS scroll-snap** + `scrollIntoView` + `scroll` / `scrollend` for index sync | No extra dependency; keeps JS surface small. DESIGN §10 open question closed in favour of hand-rolled snap. |
| URL shape | **Single route** `/{locale}/projects` only | Phase plan: carousel replaces the placeholder page in place. Per-slug URLs (`/projects/[slug]`) deferred until a SEO or shareability pass asks for them. |
| Slide width | **`min(90vw, 72rem)`** per DESIGN §7.3 — wider slides with a cap so ultra-wide monitors do not stretch prose past readability. | Stronger “hero” presence; adjacent slide still peeks on typical laptop widths. |
| Viewport | **`lg:h-dvh` + `overflow-hidden`** on shell; `main` / carousel `flex-1 min-h-0` | Aligns Projects with Home: no document vertical scroll on desktop; card interior scrolls when content overflows. |
| Controls | **Header row:** page title + subtitle (server strings) and **glass-card** prev/next (`min-h-11 min-w-11`). **Footer:** dot tablist with **44px** touch targets (outer button, inner pill per DESIGN §6). | Spec parity with DESIGN.md; meets minimum touch target guidance. |
| Keyboard | **ArrowLeft / ArrowRight** when the track (`tabIndex={0}`) is focused | Complements pointer and touch scroll. |
| Motion | **`prefers-reduced-motion: reduce`** → `scrollIntoView({ behavior: "auto" })` | Global reduced-motion policy extended to carousel navigation. |
| Children pattern | **Server `ProjectSlide` list passed as `children`** into client `ProjectsCarousel`; **`slideIds`** prop supplies stable React keys for wrappers | Avoids `cloneElement` on RSC output; keys come from `project.slug` on the server page. |
| Media gallery | **`ProjectMediaCarousel`** (client) inside each slide; **`cover`** first, then **`gallery[]`**, root-relative paths only | Multiple screenshots without leaving the card; nested `overscroll-x-contain` + inner focus for arrow keys. |
| Case study strip | Optional **`detail`** string on `Project` | Full-width prose under the grid when present. |

## Deliverables

- [`app/[locale]/projects/page.tsx`](../../app/%5Blocale%5D/projects/page.tsx) — `getProjects`, empty state, `ProjectsCarousel` + mapped `ProjectSlide`; desktop viewport shell.
- [`components/projects/projects-carousel.tsx`](../../components/projects/projects-carousel.tsx) — `"use client"`; snap track, arrows, dots, `aria-live` slide status; flex height layout.
- [`components/projects/project-media-carousel.tsx`](../../components/projects/project-media-carousel.tsx) — `"use client"`; in-card image snap carousel.
- [`components/projects/project-slide.tsx`](../../components/projects/project-slide.tsx) — async Server Component; `glass-bento-surface` card; optional `detail`; composes `ProjectMediaCarousel`.
- [`messages/en.json`](../../messages/en.json) / [`messages/tr.json`](../../messages/tr.json) — `projects.carousel`, `projects.media`, `projects.slide`, `projects.empty`, `projects.subtitle`; removed `comingSoon` string.

## Verification

- `npm run lint`, `npm run typecheck`, `npm run build` — all green.
- Manual: arrows + dots + swipe (touch); keyboard when track focused; reduced-motion instant scroll; inner gallery when `gallery` populated; `lg+` no page vertical scroll.

## Out of scope (defer)

- `/projects/[slug]` static params and deep links.
- Embla or other carousel libraries.
- Remote image domains without `next.config` `images.remotePatterns`.
