# DESIGN.md

Visual design system for **yemredev.com**.

> **Status: LOCKED in Phase 2 (refined Atmospheric+ pass).** Token values, font choices, and component utilities below are the source of truth. They are mirrored 1:1 in [app/globals.css](app/globals.css), the **Space Grotesk + JetBrains Mono** font pair is wired in [app/[locale]/layout.tsx](app/[locale]/layout.tsx), and reusable utilities (`glass-card`, `bg-mesh-gradient`, `noise-overlay`, `text-gradient-fade`) are defined as Tailwind v4 `@utility` blocks. Future phases extend this system; they do not redefine it.

## 1. Aesthetic Direction

**One-line statement.** Console-grade dark interface with mesh-gradient atmosphere — half terminal, half premium SaaS. Primary surface is near-black (`#050505`); life comes from a single cyber-blue accent and emerald status signals. Glassmorphism for cards, mono micro-copy for telemetry, gradient fades for hero typography.

**Tone keywords.** Engineered. Quiet. Atmospheric. Confident. Tactile.

**References.** John Doe AI Concierge HTML (Phase 2 brief), Vercel dashboard, Linear release notes, Raycast launcher.

**Anti-references.** Bright marketing gradients, illustration-heavy hero, sales-y copy, multiple competing accent hues, motion-as-decoration.

## 2. Color System

All tokens are CSS variables registered in `@theme` inside [app/globals.css](app/globals.css). Use semantic names (`background`, `foreground`, `muted`) in components; literal names (`accent-blue`, `accent-emerald`) only when the design demands a specific hue.

| Token | Dark (default) | Light | Usage |
| --- | --- | --- | --- |
| `--color-background-dark` | `#050505` | — | Hard-coded body background, footers |
| `--color-card-dark` | `#0A0A0A` | `#FFFFFF` | Card surfaces |
| `--color-surface` | `#0F0F0F` | `#FFFFFF` | Elevated panels, modals |
| `--color-surface-elevated` | `#141414` | `#FFFFFF` | Hover state on glass cards |
| `--color-border-dark` | `rgba(255,255,255,0.08)` | `rgba(10,10,10,0.10)` | Hairlines, dividers, glass borders |
| `--color-border-strong` | `rgba(255,255,255,0.15)` | `rgba(10,10,10,0.18)` | Hover borders, focus rings |
| `--color-primary` | `#3BB8F7` | `#3BB8F7` | Brand CTAs, focus glow, hero accents |
| `--color-accent-blue` | `#38BDF8` | `#38BDF8` | Tech category, "skills" chip |
| `--color-accent-emerald` | `#10B981` | `#10B981` | Status (online, success), "GitHub" chip |
| `--color-accent-purple` | `#C084FC` | `#C084FC` | "Experience" chip, secondary highlight |
| `--color-accent-amber` | `#FBBF24` | `#FBBF24` | "Resume" chip, warning |
| `--color-background` (semantic) | → background-dark | `#F5F7F8` | Body background (theme-aware) |
| `--color-foreground` (semantic) | `#FFFFFF` | `#0A0A0A` | Primary text |
| `--color-muted` (semantic) | `rgba(255,255,255,0.5)` | `rgba(10,10,10,0.55)` | Secondary text, captions |
| `--color-muted-foreground` (semantic) | `rgba(255,255,255,0.7)` | `rgba(10,10,10,0.75)` | Subheadings, body copy |
| `--color-border` (semantic) | → border-dark | `rgba(10,10,10,0.10)` | Default border |

Contrast verification (WCAG AA ≥ 4.5:1 body, ≥ 3:1 large):

- [x] `foreground` on `background-dark` = 21:1 (white on near-black)
- [x] `muted` on `background-dark` = ~10:1
- [x] `accent-foreground` (white) on `primary` (#3BB8F7) = 2.9:1 → **only for large/bold text or icons**
- [x] `primary` on `background-dark` = 8.5:1 (links/CTA text)
- [x] `border-dark` visible against background-dark (opacity check)

## 3. Typography

**Display + body.** [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) loaded via `next/font/google` with weights `300, 400, 500, 600, 700`, `display: "swap"`, `subsets: ["latin"]`. Self-hosted by Next.js — no external Google Fonts request at runtime. CSS variable `--font-space-grotesk` is bound to `--font-sans`. Stylistic alternates `ss01` and `ss02` are enabled globally on `body` (single-storey `a`, geometric tweaks) — the hero `<h1>` opts in additionally via `font-feature-settings` inline style. **Picked over Inter** to escape the generic "AI slop" voice flagged by the `frontend-design` skill; Space Grotesk's geometric character pairs with the dark-console aesthetic without sacrificing legibility.

**Mono.** [JetBrains Mono](https://www.jetbrains.com/lp/mono/) loaded via `next/font/google` with weights `400, 500, 600, 700`, `display: "swap"`. CSS variable `--font-jetbrains-mono` bound to `--font-mono`. Used for telemetry strips (`SYSTEM_READY`, `LATENCY: --`), `<kbd>` hints (`⌘K`, `Enter`), and technical labels. The `.font-tabular` helper opts components into `font-variant-numeric: tabular-nums` for stable digit columns.

| Role | Font | Weight | Size (Tailwind) | Line height | Tracking |
| --- | --- | --- | --- | --- | --- |
| Display (hero) | Space Grotesk | 800 | `text-4xl md:text-[3.5rem]` (2.25rem → 3.5rem) | `leading-[1.05] md:leading-[1.02]` | `tracking-[-0.04em]` |
| Heading (section) | Space Grotesk | 600 | `text-2xl md:text-3xl` | `leading-tight` | `tracking-tight` |
| Subheading | Space Grotesk | 500 | `text-lg` | `leading-relaxed` | `tracking-tight` |
| Body | Space Grotesk | 400 | `text-base` (1rem) | `leading-relaxed` (1.625) | default |
| Small / caption | Space Grotesk | 500 | `text-xs` (0.75rem) | `leading-normal` | default |
| Label / micro | Space Grotesk | 600 | `text-[10px]` uppercase | `leading-none` | `tracking-wider` |
| Mono / telemetry | JetBrains Mono | 400 | `text-xs`, `font-mono` uppercase | `leading-normal` | `tracking-wider` |
| `<kbd>` hint | JetBrains Mono | 500 | `text-[10px]–text-[11px]` | `leading-none` | default |

**Special treatment.** Hero `<h1>` uses the `text-gradient-fade` utility — a vertical white→white/60 clip — to mimic the polished console feel of the reference.

## 4. Spacing & Layout

- **Base unit:** 4px (Tailwind default scale).
- **Container:** `max-w-4xl` for centered narrative pages (landing); `max-w-[1800px]` for bento dashboard (Phase 3); `max-w-7xl` for carousel (Phase 4).
- **Header height:** `h-[70px]`, sticky, `z-40`, `backdrop-blur` over `background-dark/50`.
- **Page padding:** `px-4 sm:px-6 md:px-8` outer, `gap-4` between bento cards.
- **Single-viewport pages.** Landing, Home, **Projects** (`lg+`), Contact, Portfolio Detail all enforce `min-h-dvh` with `overflow-hidden` on the page wrapper (`Projects` also sets `lg:h-dvh`). Internal scroll only inside dedicated regions (Experience timeline on Phase 3 bento; on Projects, the project card body — right column prose and optional `detail` strip — may scroll inside the card while the page stays fixed at `lg+`).

## 5. Motion

| Pattern | Duration | Easing | Where |
| --- | --- | --- | --- |
| `pulse-slow` | 4s | `cubic-bezier(0.4, 0, 0.6, 1)` infinite | Hero center glow, FAB chat icon |
| `float` | 6s | `ease-in-out` infinite alternate | Decorative blobs in Phase 3 cards |
| `blink` | 1s | `step-end` infinite | Caret in chat input (decorative) |
| `fade-in` | 0.5s | `ease-out` once | Hero block on landing mount |
| Hover (color/border) | 200ms | `ease` | Buttons, chips, links |
| Hover (transform) | 300–500ms | `ease` | Card lift, icon translate |

All keyframes registered in [app/globals.css](app/globals.css). Tailwind utilities resolve from `--animate-*` tokens (e.g. `animate-pulse-slow`).

`prefers-reduced-motion: reduce` shortens every animation/transition to 0.01ms (already wired globally).

## 6. Components

For each: **states** (default / hover / focus / disabled), **sizing**, **radius**.

- **Button — primary.** White surface, black text, `rounded-2xl` (large) or `rounded-lg` (small). Hover → `bg-gray-200`. Focus → `focus-visible:ring-2 ring-primary/60`. Sizing: `h-14 px-6` (large CTA), `h-9 px-3 text-xs` (header).
- **Button — ghost.** `bg-white/5`, border `white/10`, text `white/70`. Hover → `bg-white/10` + text-white. Same focus ring.
- **Button — accent (FAB).** `bg-primary`, text-black, `h-14 w-14 rounded-full`, `shadow-[0_0_20px_rgba(56,189,248,0.3)]`. Hover scales 110% + brighter shadow.
- **Input.** `glass-card` surface, `rounded-xl`, `h-12 px-4`, placeholder `text-white/20`, caret `caret-primary`. Focus → `glow-input-focused` utility (cyan box-shadow + primary border). Use `input-glass` class on bare inputs that don't sit inside a glass shell.
- **Chip / Badge.** `rounded-full` (pill) or `rounded` (tag), `bg-white/5`, `border-white/10`, `text-xs text-white/70`, optional colored lucide icon (accent-blue, accent-emerald, accent-purple, accent-amber). Hover lifts `translate-y-[-1px]` + brightens border.
- **Card (glass).** `glass-card` utility → `rounded-2xl`, hover deepens background to `surface-elevated`. Padding `p-6` default, `p-8` for hero cards.
- **Status dot.** `w-2.5 h-2.5 rounded-full bg-accent-emerald` + concentric `animate-ping` ring. Used wherever "available", "online", or "ready" is signalled.
- **Carousel arrows / dots** — Phase 4. Spec frozen here for consistency: `size-11 rounded-full glass-card` arrows; dots `h-1 w-1.5` inactive / `h-1 w-8 bg-primary` active.
- **Toast** — Phase 5. Spec deferred until contact provider chosen.

## 7. Per-Page Layouts

### 7.1 Landing — AI Assistant (Phase 2, **shipped**)

- **Header** (`LandingHeader`, minimal): `h-[70px]`, logo (32×32 initials box + name + role subtitle), right side: `⌘K` hint chip (md+), `Skip Intro` ghost button (`/home`), `LanguageSwitcher`, `ThemeToggle`.
- **Background** (`MeshBackground withCenterPulse`): mesh gradient overlay + 800×800 `bg-primary/5 blur-[120px] animate-pulse-slow` centered.
- **Main** (`max-w-4xl mx-auto`, vertically centered):
  1. Avatar block (`w-16 h-16 rounded-2xl`, `Bot` icon, primary blur backdrop, emerald status dot).
  2. Hero `<h1>` + `<p>` subtitle (`text-gradient-fade` on heading).
  3. Quick-action chips (4 items, color-coded icons).
  4. Chat input bar (sparkles + readonly input + mic + send buttons; static).
  5. Telemetry hint row (model name + Enter hint).
- **Footer** (`LandingFooter`): mono mini-strip — `SYSTEM_READY` / `LATENCY: --` left, `VERSION 0.1.0` / copyright right.

### 7.2 Home — Bento Dashboard (Phase 3, shipped)

**Variant:** hybrid — v3 6-cell topology + v1 mockup-forward hero + v2 "View all projects" affordance routed to `/projects`. See [docs/phases/phase-3.md](docs/phases/phase-3.md) for the decision log.

**Hard rule:** **no vertical scroll on the page** at `lg+`, only inside the `ExperienceTimeline` card. Below `lg` the bento collapses to a single column (`grid-cols-1`) and page scroll is permitted — anything else makes mobile content unreachable.

**Grid (`lg:grid-cols-4 lg:grid-rows-6`, `gap-4`):**

| Cell | Component | Position |
| --- | --- | --- |
| 1×2 top-left | `StatusBlock` | `lg:col-start-1 lg:row-start-1 lg:row-span-2` |
| 1×4 left | `TechStack` | `lg:col-start-1 lg:row-start-3 lg:row-span-4` |
| 2×4 center | `FeaturedProject` (whole tile = `<Link href="/projects">`) | `lg:col-start-2 lg:col-span-2 lg:row-start-1 lg:row-span-4` |
| 1×4 right | `ExperienceTimeline` (only internal scroll) | `lg:col-start-4 lg:row-start-1 lg:row-span-4` |
| 2×2 bottom-center | `OpenSourceHighlight` | `lg:col-start-2 lg:col-span-2 lg:row-start-5 lg:row-span-2` |
| 1×2 bottom-right | `EducationCTA` (single primary CTA → `/contact`) | `lg:col-start-4 lg:row-start-5 lg:row-span-2` |

Plus `FloatingAssistantFab` (fixed bottom-right, `z-30`, hidden on `<sm`) — inverse of the landing's "Skip Intro" CTA, routes back to `/{locale}` (the AI assistant).

**Card shell:** every cell uses [`BentoCard`](components/home/bento-card.tsx) — `rounded-2xl` + the `glass-bento-surface` utility (high-opacity frosted gradient, `blur(22px) saturate(150%)`, inset hairline, depth shadow) + `p-5`. The featured tile applies the same surface on the `<Link>` root with stronger hover shadow + primary border tint.

### 7.3 Projects detail carousel (Phase 4, **shipped**)

Snap-x horizontal carousel: section container **`max-w-[min(100%,92rem)]`**; each slide **`w-[min(90vw,72rem)]`** (`min` caps width on very large viewports), **`snap-x` / `snap-start`**, prev/next **`min-h-11 min-w-11` `glass-card`** round buttons, bottom dots use a **`min-h-11 min-w-11`** touch target with inner pill **`h-1 w-1.5`** inactive / **`h-1 w-8 bg-primary`** active. **Desktop (`lg+`):** page shell matches Home — **`lg:h-dvh` + `overflow-hidden`** on the route wrapper; `ProjectsCarousel` fills remaining height under the header (`flex-1 min-h-0`). **Project card:** optional full-width **`detail`** string below the 2-column grid; **media:** [`ProjectMediaCarousel`](components/projects/project-media-carousel.tsx) (client) snap-scrolls **`cover` + `gallery[]`** root-relative images inside the preview frame. Card hover emphasises **border / ring**, not extra drop shadow. Lives at `/{locale}/projects`. Implementation: [`components/projects/projects-carousel.tsx`](components/projects/projects-carousel.tsx) (client) + [`components/projects/project-slide.tsx`](components/projects/project-slide.tsx) (server) + `ProjectMediaCarousel`. See [docs/modules/projects-page.md](docs/modules/projects-page.md).

### 7.4 Contact (Phase 5, **shipped — formless**)

**No form:** the page is **Server Components only** — route shell **`overflow-hidden`** + **`lg:h-dvh`** (same as Home/Projects): **`main`** is `flex-1 min-h-0`, **`items-center`**, **`overflow-hidden`** (no page scroll), inner **`my-auto`** centers the block in the header viewport. Content: optional **availability** pill, **split headline** + subtitle; **Email** / **Location** (stacked), **1px hairline**, **`ContactSocialPanel`**. Copy under `contact.*`. `MeshBackground` + `AppHeader`. Files: [`app/[locale]/contact/page.tsx`](app/[locale]/contact/page.tsx), [`components/contact/contact-social-panel.tsx`](components/contact/contact-social-panel.tsx). See [docs/modules/contact-page.md](docs/modules/contact-page.md).

## 8. Accessibility Checklist (must hold for every screen)

- [x] Body text contrast ≥ 4.5:1 (white/70 on #050505 = 11.5:1)
- [x] Visible `:focus-visible` ring on every interactive element (`ring-primary/60`)
- [x] All interactive elements ≥ 44×44 px touch target (header buttons `h-9` get `min-h-11` via padding/hit area)
- [x] Icon-only buttons have `aria-label` (LanguageSwitcher, ThemeToggle, mic, send)
- [x] No information conveyed by color alone (status dot pairs with text "Available", chip icons paired with text)
- [x] Reduced-motion respected
- [x] Both themes audited independently (light is functional, not pixel-perfect)
- [x] Tab order matches visual order

## 9. Performance Budget

- Lighthouse Performance ≥ 95 (mobile)
- LCP ≤ 2.0s on 4G (landing has no images — LCP element is the hero `<h1>`)
- CLS < 0.05 (Space Grotesk + JetBrains Mono loaded with `display: "swap"` + variables bound; noise overlay is `background-image` only — no layout shift)
- Total JS shipped on landing ≤ 100 KB gzipped (no client components beyond `LanguageSwitcher` + `ThemeToggle` until Phase 6)

## 10. Open Questions (revisit between phases)

- **Phase 3 home variant.** v1 (image-mockup hero card), v2 (project list inside hero card), or v3 (compact Tech Stack + Featured project) — pick at Phase 3 kickoff.
- ~~**Phase 4 carousel library.** Embla vs hand-rolled snap-scroll — decide once project count & swipe gesture priorities are confirmed.~~ **Closed in Phase 4** — native CSS scroll-snap + one client wrapper; see [docs/phases/phase-4.md](docs/phases/phase-4.md).
- **Phase 5 contact.** **Shipped formless** — `mailto` + `profile.social` cards; no hosted form provider on this route. Historical comparison: [docs/3rd-party/contact-providers.md](docs/3rd-party/contact-providers.md).
- **Phase 6 AI provider + system prompt persona.** See [docs/3rd-party/ai-providers.md](docs/3rd-party/ai-providers.md).
