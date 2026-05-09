# Projects page (carousel)

## Purpose

The **case-study / portfolio detail** surface at `/{locale}/projects`. Visitors land here from the home featured tile, header nav, or future deep links. Each **project** from [`content/projects.{locale}.json`](../../content/projects.en.json) occupies one **horizontal slide** in a snap carousel; the page stays a **single URL** (no per-slug route in Phase 4).

## Source of truth

- Page: [`app/[locale]/projects/page.tsx`](../../app/%5Blocale%5D/projects/page.tsx)
- Carousel chrome (client): [`components/projects/projects-carousel.tsx`](../../components/projects/projects-carousel.tsx)
- In-card media gallery (client): [`components/projects/project-media-carousel.tsx`](../../components/projects/project-media-carousel.tsx)
- Slide body (server): [`components/projects/project-slide.tsx`](../../components/projects/project-slide.tsx)
- Data: [`lib/data.ts`](../../lib/data.ts) — `getProjects(locale)`
- Types: [`types/project.ts`](../../types/project.ts)
- Strings: `projects.*` in [`messages/en.json`](../../messages/en.json) / [`messages/tr.json`](../../messages/tr.json)
- Visual spec: [DESIGN.md](../../DESIGN.md) §7.3 + §6 carousel arrows / dots

## Anatomy

```
┌─────────────────────────────────────────────────────────────┐
│ AppHeader                                                    │
├─────────────────────────────────────────────────────────────┤
│  <h1> + subtitle          │  [ ◀ prev ] [ next ▶ ]         │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│  │ … media +   │ │              │ │              │        │
│  │   detail    │ │              │ │              │        │
│  └──────────────┘ └──────────────┘ └──────────────┘        │
├─────────────────────────────────────────────────────────────┤
│              ● ━━━ ○ ○   (dots — active / inactive)         │
└─────────────────────────────────────────────────────────────┘
```

## Rules

- **Client islands.** `ProjectsCarousel` is `"use client"` for the outer project track. Each slide mounts `ProjectMediaCarousel` (`"use client"`) for `cover` + `gallery` screenshots inside the preview frame. Slides otherwise stay Server Components for data + i18n via `getTranslations("projects.slide")`.
- **Stable keys.** The page passes `slideIds={projects.map((p) => p.slug)}` so wrapper `div`s around each RSC child never rely on cloning or reading opaque child props.
- **Empty list.** If `getProjects` returns `[]`, render the `projects.empty` copy — do not mount the carousel.
- **Images.** `ProjectMediaCarousel` uses `next/image` for **root-relative** paths (`"/…"`). Remote URLs need `images.remotePatterns` in `next.config.ts` — keep assets under [`public/`](../../public/) until configured.
- **Optional copy.** `detail` on a project renders a full-width case-study strip at the bottom of the card when set; omit the field to hide the block.
- **Viewport (`lg+`).** Page matches Home: no vertical document scroll; overflow is clipped on the shell and the card/grid uses `min-h-0` + internal scroll where needed.
- **Accessibility.** Region `aria-label`, `aria-live` polite for slide index, dot buttons with `aria-label` + `aria-selected`, prev/next `aria-label`s from `projects.carousel.*` and `projects.media.*`.

## Adding a project

1. Add an object to [`content/projects.en.json`](../../content/projects.en.json) and [`content/projects.tr.json`](../../content/projects.tr.json) with the same `slug`.
2. Match the [`Project`](../../types/project.ts) shape (`links` may be `[]`).
3. Optional: set `cover` to `/your-image.jpg` under [`public/`](../../public/).
4. Optional: add `gallery` (`string[]` of root-relative paths) for extra screenshots inside the in-card media carousel.
5. Optional: add `detail` for a full-width case-study paragraph below the main grid.

## Changing carousel behaviour

- **Slide width:** edit the wrapper class in [`projects-carousel.tsx`](../../components/projects/projects-carousel.tsx) (`w-[min(90vw,72rem)]`).
- **Scroll sync:** overlap logic lives in `syncActiveFromScroll`; tweak if slide widths or gaps change materially.
