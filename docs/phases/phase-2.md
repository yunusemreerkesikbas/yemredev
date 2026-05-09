# Phase 2 — AI Assistant Landing + Core Design

> **Status:** Shipped. Landing page renders the final visual language; chat behaviour is intentionally static and lights up in Phase 6.

## Locked-in decisions

| Topic | Decision | Why |
| --- | --- | --- |
| Chat behaviour | Static UI — input `readOnly`, chips non-clickable | Phase 6 owns the actual API + state work; shipping the visual now keeps the polish budget where it matters. |
| Icon library | `lucide-react` only | Already installed, tree-shakable per icon, matches Vercel/shadcn ecosystem. Material Symbols evaluated and rejected (extra ~200 KB web font). |
| Header strategy | Two server components: `LandingHeader` + `AppHeader` | Landing chrome (Skip CTA) is too different from app chrome (nav links) to share one route-aware component. Two simple files beat one branchy one. |
| ~~Inter font~~ → **Space Grotesk + JetBrains Mono** | Both self-hosted via `next/font/google`, `display: "swap"`. See refinement pass below. | Inter triggered the `frontend-design` skill's "AI slop" warning; the new pair gives the landing distinctive geometric character without sacrificing legibility. |
| Skip CTA target | `/{locale}/home` (the bento dashboard, Phase 3) | Reference design wording wins; route name to be revisited at Phase 3 kickoff. |
| Light theme polish | Functional only; landing optimised for dark | Spending light-mode polish budget before bento exists is premature. |

## Open / Deferred

- **Phase 3 home variant choice** — v1 (image-mockup hero card), v2 (project list inside hero card), v3 (compact stack + featured) — pick at kickoff.
- **Carousel library** — Embla vs hand-rolled snap-scroll. Decide before Phase 4.
- **Contact provider** — see [docs/3rd-party/contact-providers.md](../3rd-party/contact-providers.md).
- **AI provider for Phase 6** — see [docs/3rd-party/ai-providers.md](../3rd-party/ai-providers.md).
- ~~**/home vs /portfolio naming** — current routes feel ambiguous against the "Skip to Portfolio" CTA. Revisit when Phase 3 ships.~~ **Closed in Phase 3** — `/portfolio` was renamed to `/projects`, the Skip CTA copy went neutral ("Skip Intro" / "Girişi atla"), and `/home` stays as the bento dashboard. See [phase-3.md](phase-3.md).

## What changed in the codebase

### New files

- [components/layout/landing-header.tsx](../../components/layout/landing-header.tsx)
- [components/layout/app-header.tsx](../../components/layout/app-header.tsx)
- [components/layout/mesh-background.tsx](../../components/layout/mesh-background.tsx)
- [components/landing/landing-hero.tsx](../../components/landing/landing-hero.tsx)
- [components/landing/quick-action-chips.tsx](../../components/landing/quick-action-chips.tsx)
- [components/landing/chat-input-bar.tsx](../../components/landing/chat-input-bar.tsx)
- [components/landing/landing-footer.tsx](../../components/landing/landing-footer.tsx)
- [docs/modules/landing-page.md](../modules/landing-page.md)
- This file.

### Updated files

- [app/globals.css](../../app/globals.css) — full token rewrite, Inter wired into `--font-sans`, `@utility` blocks for `bg-mesh-gradient`, `glass-card`, `glass-strong`, `glow-input`, `text-gradient-fade`, `no-scrollbar`. Custom `pulse-slow` / `float` / `blink` / `fade-in` keyframes registered as `--animate-*` tokens.
- [app/[locale]/layout.tsx](../../app/[locale]/layout.tsx) — Inter `next/font/google` setup, `--font-inter` variable bound, global `<Header />` removed, `<main>` wrapper removed (each page handles its own scaffold now).
- [app/[locale]/page.tsx](../../app/[locale]/page.tsx) — landing composition.
- [app/[locale]/home/page.tsx](../../app/[locale]/home/page.tsx), [app/[locale]/portfolio/page.tsx](../../app/[locale]/portfolio/page.tsx), [app/[locale]/contact/page.tsx](../../app/[locale]/contact/page.tsx) — each gains `AppHeader` + `MeshBackground withCornerAccents`. Body still says "Coming in Phase X".
- [app/[locale]/not-found.tsx](../../app/[locale]/not-found.tsx) — gains `MeshBackground` and the gradient-fade heading treatment.
- [content/profile.en.json](../../content/profile.en.json), [content/profile.tr.json](../../content/profile.tr.json) — add `initials: "YE"`.
- [types/profile.ts](../../types/profile.ts) — `Profile` gains required `initials: string`.
- [messages/en.json](../../messages/en.json), [messages/tr.json](../../messages/tr.json) — `landing.*` namespace expanded with `header / hero / chips / input / footer` sub-trees. New `appHeader.*` namespace for the dashboard nav.
- [DESIGN.md](../../DESIGN.md) — every TBD section filled in.
- [docs/global/theming.md](../global/theming.md) — token map updated, composite utilities documented.
- [docs/global/conventions.md](../global/conventions.md) — Inter rule replaces "no fonts before DESIGN.md".
- [docs/modules/header-navigation.md](../modules/header-navigation.md) — dual-variant pattern documented.

### Deleted files

- `components/layout/header.tsx` — split into `landing-header.tsx` + `app-header.tsx`.

## Verification

| Check | Result |
| --- | --- |
| `npm run lint` | Pass (0 warnings) |
| `npm run typecheck` | Pass (0 errors) |
| `npm run build` | Pass — 8 SSG routes (TR + EN × 4), 2 dynamic API routes |
| HTTP smoke `/` | 307 → `/en` (default locale, US client) |
| HTTP smoke `/en`, `/tr` | 200 |
| HTTP smoke `/en/home`, `/tr/home`, `/en/portfolio`, `/en/contact` | 200 |
| HTML markers (EN) | Hero title, Skip CTA, telemetry strip, mesh utility, gradient-fade, lucide icons (Bot/Sparkles/ArrowUp), initials `YE` all present |
| HTML markers (TR) | Localized hero, "Portfolyoya geç" CTA, `SISTEM_HAZIR` telemetry present |
| Inter font wiring | `<html class="inter_…__variable …">` + `inter_…_module_….css` chunk loaded — Turbopack module pattern (variant of Webpack's `__variable_xxx`) |
| Manual browser checks | Deferred to user — open `/en` and `/tr` in dev to verify gradient text clip, mesh atmosphere, chip hover lift, focus-within glow, theme toggle flicker-free swap, reduced-motion behaviour |

## Atmospheric+ refinement pass (post-ship)

Run after the initial Phase 2 ship to apply the `frontend-design`, `web-design-guidelines`, and `ui-ux-pro-max` skills to the landing page.

### Decisions

| Topic | Decision | Why |
| --- | --- | --- |
| Font pair | Space Grotesk (sans, 300–700) + JetBrains Mono (mono, 400–700) | Inter flagged as generic by the `frontend-design` skill. Space Grotesk has unmistakable geometric character; JetBrains Mono is the canonical "engineer console" mono. Both ship via `next/font/google` so CLS stays at 0. |
| OpenType features | `kern`, `liga`, `ss01` enabled globally on `<body>`; hero `<h1>` adds `ss02` inline | Picks up Space Grotesk's stylistic alternates that read more deliberate (single-storey `a`, geometric tweaks) without paying a bundle cost. |
| Aesthetic intensity | **Atmospheric+** (over Refined-minimal and Editorial-console) | Stronger 3-stop mesh, SVG fractal-noise grain overlay, hero sparkle particles, heavier display weight + tighter tracking. Adds depth without breaking the dark-console identity. |
| Mesh gradient | 2-stop → **3-stop** (primary 16% top-center / emerald 10% top-right / purple 8% bottom-left), opacity 80% → 90% | Reference dark canvas read flat; the third color stop adds dimensional asymmetry and prevents the gradient from bunching at the top. |
| Noise overlay | Inline SVG `data:` URL, `feTurbulence baseFrequency=0.85 numOctaves=2`, 6% opacity, `mix-blend-mode: soft-light` | Texture without bandwidth cost (≈ 250 bytes inline). `soft-light` blend keeps it subtle in dark, switches to `multiply` at 3.5% on light. |
| Sparkle particles | 8 absolutely-positioned dots with per-instance delay/duration + `animate-float`, behind hero, `pointer-events-none`, `aria-hidden`. Inline `style` for color/position because Tailwind JIT cannot detect dynamic class concat. | Adds organic motion to the canvas. CSS-only, no JS bundle cost. Halted automatically by the global `prefers-reduced-motion` media query in `app/globals.css`. |
| Hero typography polish | `font-bold` → `font-extrabold` (700 → 800), `tracking-tight` → `tracking-[-0.04em]`, base size `text-3xl md:text-5xl` → `text-4xl md:text-[3.5rem]`, leading `1.05 → 1.02` on desktop | Display weight that earns its size, tighter tracking that reads as "console headline" not "blog post". |
| Avatar polish | New outer shadow (`0 8px 40px -12px rgba(59,184,247,0.45) + 0 0 0 1px rgba(255,255,255,0.04) inset`), top hairline gradient, drop-shadow on the icon, online dot now pulses | Anchors the hero with a single magnetic focal point per `ui-ux-pro-max` "primary-action / single magnetic focal point" rule. |
| `<kbd>` semantic | `<span>⌘</span><span>K</span>` → atomic `<kbd>⌘K</kbd>` (header) and `<kbd>Enter</kbd>` (input) | Vercel guideline — keyboard hints get the semantic element. Atomic string also removes the line-break risk that NBSP would otherwise paper over. |
| Quick-action chips semantics | `<div role="list">` / `<div role="listitem">` → `<ul>` / `<li>` | "Semantic HTML before ARIA" rule. Same visual, fewer roles to maintain. |
| Chat input attrs | Added `name="prompt"`, `autoComplete="off"`, `inputMode="text"`, `spellCheck={false}` | Statik durum aynı kalıyor ama Phase 6'da gerçek POST'a geçtiğinde input zaten doğru pattern'de olacak. |
| Typography ellipsis | All `...` → `…` in `messages/*.json` (placeholder + `common.loading`) | Vercel typography rule. |
| Telemetry strip | Added `font-tabular`, `uppercase tracking-wider`, opacity `text-white/20` → `text-white/25` | Stable digit columns + clearer "system telemetry" voice. |

### Bundle / perf impact

- `+1` font family network payload (JetBrains Mono); both still self-hosted, weights tree-shaken.
- Noise overlay = inline SVG (≈ 250 bytes), no extra request.
- Sparkles = 8 `<span>` server-rendered, no JS.
- No new client components. Landing remains 2 client islands (`LanguageSwitcher`, `ThemeToggle`).

### Files touched in this pass

- `app/[locale]/layout.tsx` — Inter import → Space Grotesk + JetBrains Mono
- `app/globals.css` — `--font-sans` / `--font-mono` rebind, 3-stop mesh, new `noise-overlay` `@utility`, body `font-feature-settings`, `.font-tabular` helper, light-theme variants of mesh/noise
- `app/[locale]/page.tsx` — `<MeshBackground withCenterPulse withSparkles />`
- `components/layout/mesh-background.tsx` — new `withNoise` (default `true`) + `withSparkles` props, layered render order documented inline
- `components/landing/sparkle-particles.tsx` — **new** server component
- `components/landing/landing-hero.tsx` — display polish (weight, tracking, leading, avatar shadow + hairline + drop-shadow + pulsing dot, OpenType inline)
- `components/landing/chat-input-bar.tsx` — `<kbd>`, `name`/`autoComplete`/`inputMode`/`spellCheck`, `font-tabular` telemetry
- `components/layout/landing-header.tsx` — atomic `<kbd>⌘K</kbd>`
- `components/landing/quick-action-chips.tsx` — `<ul>` / `<li>` semantic, `cn()` helper
- `messages/en.json` + `messages/tr.json` — `…` ellipsis fixes, `cmdkHint` now `⌘K`
- `DESIGN.md`, `docs/global/theming.md`, `docs/global/conventions.md` — typography section, token map, font rule swapped
- This file.

## Next phase

Phase 3 — Bento dashboard at `/{locale}/home`. Pick a reference variant (v1 / v2 / v3), populate `content/profile.*.json` with real data (replace TBD strings), and consider the `/home` ↔ `/portfolio` rename. **Shipped — see [phase-3.md](phase-3.md).**
