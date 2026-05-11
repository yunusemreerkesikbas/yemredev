# Landing Page (AI Assistant)

## Purpose

The first thing every visitor sees: a single-viewport, console-grade introduction to "Yemre's AI Assistant". The screen is **static in Phase 2** — the visual language is final, but the chat input and chips are non-interactive. Phase 6 will swap the static input for a real chat session backed by `/api/chat`.

A persistent "Skip to Portfolio" CTA in the top-right gives visitors who don't care about AI a one-click escape to the bento dashboard at `/[locale]/home`.

## Source of truth

- Page composition: [app/[locale]/page.tsx](../../app/[locale]/page.tsx)
- Header variant: [components/layout/landing-header.tsx](../../components/layout/landing-header.tsx)
- Skip Intro transition (client): [components/layout/skip-intro-transition.tsx](../../components/layout/skip-intro-transition.tsx) — Motion iris toward the home FAB before `router.push('/home')`; respects `prefers-reduced-motion`.
- Iris overlay primitives (client): [components/layout/iris-transition-portal.tsx](../../components/layout/iris-transition-portal.tsx) — shared `toFab` / `toLanding` mask animation used by Skip Intro and the home FAB.
- Background atmosphere: [components/layout/mesh-background.tsx](../../components/layout/mesh-background.tsx) (with `withCenterPulse`)
- Sub-components:
  - [components/landing/landing-hero.tsx](../../components/landing/landing-hero.tsx)
  - [components/landing/quick-action-chips.tsx](../../components/landing/quick-action-chips.tsx)
  - [components/landing/chat-input-bar.tsx](../../components/landing/chat-input-bar.tsx)
  - [components/landing/landing-footer.tsx](../../components/landing/landing-footer.tsx)
- String catalog: `landing.*` keys in [messages/en.json](../../messages/en.json) / [messages/tr.json](../../messages/tr.json)
- Future API endpoint: [app/api/chat/route.ts](../../app/api/chat/route.ts) (Phase 6)

## Anatomy

```
┌─────────────────────────────────────────────────────────────────┐
│  LandingHeader  [YE Yemre]            [⌘K] [Skip→] [TR EN] [☼]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                       ┌──────┐                                  │
│                       │  Bot │   ← LandingHero                  │
│                       └──────┘                                  │
│                                                                 │
│             Hello. I'm Yemre's AI Assistant.                    │
│       I can answer questions about frontend craft…              │
│                                                                 │
│   [Skills] [GitHub] [Experience] [Resume] [Craftive] [SAP]       │
│                       ← QuickActionChips                        │
│                                                                 │
│   ┌───────────────────────────────────────────────┐             │
│   │ ✨  Ask anything about my stack...   🎤 [↑]   │             │
│   └───────────────────────────────────────────────┘             │
│   • AI Model: Coming in Phase 6     Press Enter (Phase 6)       │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  SYSTEM_READY              VERSION 0.1.0 / © YEAR YEMREDEV.COM  │
│  LATENCY: --                                                    │
└─────────────────────────────────────────────────────────────────┘
```

## Sub-component contracts

### `LandingHero`

- Server component. Reads `landing.hero.*` translations.
- Renders the 64×64 avatar (lucide `Bot` + emerald status dot + primary blur backdrop), the gradient `<h1>` (`text-gradient-fade` utility), and the muted subtitle.
- No props. The avatar dot is decorative; an `<span class="sr-only">` carries `landing.hero.avatarAlt` for screen readers.

### `QuickActionChips`

- Client component (`"use client"`). Reads `landing.chips.*` translations.
- Renders 6 chips from the local `CHIPS` const (key + lucide icon + accent class). Each chip is a `<button>` inside a `<ul>`; clicking sends the matching `landing.chips.prompts.<key>` string through the parent `ChatIsland` handler.

### `ChatInputBar`

- Server component. Reads `landing.input.*` translations.
- Renders a real `<input type="text" readOnly tabIndex={-1}>` plus mic + send buttons (`disabled`, `tabIndex={-1}`). The input is `aria-readonly` and the buttons carry localized `aria-label`s that say "coming in Phase 6", so assistive tech doesn't promise functionality the page can't deliver.
- Visual states match the reference:
  - default: hairline border, near-black surface
  - focus-within: cyan box-shadow + primary border (via `glow-input` patterns inline)
- Phase 6 swap: add `"use client"`, remove `readOnly`/`tabIndex`/`disabled`, attach `useState` for input value + `useTransition` for submit, POST to `/api/chat`.

### `LandingFooter`

- Server component. Reads `landing.footer.*` translations.
- Mono telemetry strip (`pointer-events-none`, `select-none`) — `SYSTEM_READY` / `LATENCY: --` left, `VERSION 0.1.0` / `© YEAR YEMREDEV.COM` right.
- The `{year}` token in `landing.footer.copyright` is interpolated server-side from `new Date().getFullYear()`. Acceptable timezone drift because the footer is mono and decorative.

## Rules and invariants

- **Single viewport.** The page wrapper uses `min-h-dvh overflow-hidden`. Don't add `<section>` blocks that overflow — the design intent is "everything fits".
- **Server-first body.** Until Phase 6, keep the landing **body** server-only (hero, chips, input shell, footer). The header mounts **three** client islands: `LanguageSwitcher`, `ThemeToggle`, and `SkipIntroTransitionLink` (iris transition via [motion](https://motion.dev), portal overlay `z-index` above the header). With `prefers-reduced-motion: reduce`, Skip navigates immediately with no animation.
- **Static input is real.** Don't replace `<input>` with `<div>` to "prevent typing". The real element gives the focus-within glow and matches what Phase 6 will render — fewer regressions.
- **Profile drives the header, not the body.** Hero text, chips, and footer all come from i18n strings, not from `content/profile.*.json`. This decouples copy translation from data structure.
- **Initials must be 2 characters.** Both `profile.en.json` and `profile.tr.json` set `initials: "YE"`. If the displayed name changes, update both files.

## Skip CTA naming

The CTA reads "Skip Intro" (en) / "Girişi atla" (tr) and links to `/{locale}/home` — the bento dashboard. The earlier "Skip to Portfolio" / "Portfolyoya geç" wording was retired in Phase 3 alongside the `/portfolio` → `/projects` rename so a single neutral copy survives the route shuffle.

On primary activation (no modifier keys), the control plays a short **iris / lens-close** transition: a masked overlay shrinks the visible hole from the viewport center to the same bottom-right geometry as [`FloatingAssistantFab`](../../components/home/floating-assistant-fab.tsx) (including `max(1rem, env(safe-area-inset-*))`), then reveals a transient FAB-styled `Bot` icon before navigation. Cmd/Ctrl/middle-click and similar keep native link behavior without intercepting the animation.

The FAB uses the same overlay with variant **`toLanding`** (hole expands from the FAB anchor toward the viewport center) before returning to the landing route — the inverse timing of Skip Intro.

## Adding a new chip

1. Pick a lucide icon (see [theming.md](../global/theming.md) for the icon-only convention).
2. Add an entry to the `CHIPS` array in [components/landing/quick-action-chips.tsx](../../components/landing/quick-action-chips.tsx) — `{ key, Icon, iconClass }`.
3. Add the localized label under `landing.chips.items.<key>` in **both** message catalogs.
4. If the chip should ship a real prefilled prompt in Phase 6, add a `prompt` field to the chip type and store the localized prompt under `landing.chips.prompts.<key>`.

## Gotchas

- **`text-gradient-fade` clips text.** Make sure any element using it also has `pb-2` (or similar) so descenders aren't cut by the clip mask.
- **Avatar emerald dot has its own animation budget.** It uses `pulse-slow` (4s); don't add a second pulse near it without re-evaluating motion density.
- **Mesh background sits at z-0.** All page content must have `relative z-10` (the page wrapper handles it for direct children — but if you add an absolutely-positioned overlay, set `z-10` or `z-20` explicitly).
- **Footer is `pointer-events-none`.** Decorative only. Don't put a real link in there.
- **Don't import client components for icons.** lucide icons are server-safe. Treating them as client islands would inflate the bundle.
