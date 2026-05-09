# Theming

## What it is / why it exists

Two themes: **dark** (default) and **light**. The active theme is stored in `localStorage` (key: `theme`) by [next-themes](https://github.com/pacocoursey/next-themes) and applied as a class on `<html>` (`dark` or `light`). All colors are CSS variables defined as Tailwind v4 `@theme` tokens, so components consume **either**:

- **Semantic** classes (`bg-background`, `text-foreground`, `border-border`) — when the same surface should swap with the theme.
- **Literal** classes (`bg-background-dark`, `text-accent-emerald`) — when a panel is intentionally dark-only or anchored to a brand hue.

Landing, home, portfolio, contact, and 404 are dark-first by design; light is functional but not pixel-perfect (Phase 2 polish budget). `enableSystem` is `false` — the user's OS preference is intentionally ignored so the experience is dark on first paint.

## Source of truth

- Token sheet: [app/globals.css](../../app/globals.css)
- Canonical design system: [DESIGN.md](../../DESIGN.md)
- Provider wrapper: [components/providers/theme-provider.tsx](../../components/providers/theme-provider.tsx)
- Provider mount: [app/[locale]/layout.tsx](../../app/[locale]/layout.tsx)
- Toggle button: [components/layout/theme-toggle.tsx](../../components/layout/theme-toggle.tsx)

## Token map (Phase 2 — locked)

| Token | Dark (default) | Light | Tailwind class |
| --- | --- | --- | --- |
| `--color-background-dark` | `#050505` | (same) | `bg-background-dark` |
| `--color-card-dark` | `#0A0A0A` | `#FFFFFF` | `bg-card-dark` |
| `--color-surface` | `#0F0F0F` | `#FFFFFF` | `bg-surface` |
| `--color-surface-elevated` | `#141414` | `#FFFFFF` | `bg-surface-elevated` |
| `--color-border-dark` | `rgba(255,255,255,0.08)` | `rgba(10,10,10,0.10)` | `border-border-dark` |
| `--color-border-strong` | `rgba(255,255,255,0.15)` | `rgba(10,10,10,0.18)` | `border-border-strong` |
| `--color-primary` | `#3BB8F7` | `#3BB8F7` | `bg-primary`, `text-primary`, `ring-primary` |
| `--color-accent-blue` | `#38BDF8` | `#38BDF8` | `text-accent-blue` |
| `--color-accent-emerald` | `#10B981` | `#10B981` | `text-accent-emerald`, `bg-accent-emerald` |
| `--color-accent-purple` | `#C084FC` | `#C084FC` | `text-accent-purple` |
| `--color-accent-amber` | `#FBBF24` | `#FBBF24` | `text-accent-amber` |
| `--color-background` (semantic) | → background-dark | `#F5F7F8` | `bg-background` |
| `--color-foreground` (semantic) | `#FFFFFF` | `#0A0A0A` | `text-foreground` |
| `--color-muted` (semantic) | `rgba(255,255,255,0.5)` | `rgba(10,10,10,0.55)` | `text-muted` |
| `--color-border` (semantic) | → border-dark | `rgba(10,10,10,0.10)` | `border-border` |
| `--font-sans` | Space Grotesk (variable, self-hosted) | (same) | `font-sans` (default) |
| `--font-mono` | JetBrains Mono (variable, self-hosted) | (same) | `font-mono` |

Composite utilities (defined as `@utility` in globals.css):

| Utility | Effect | Used by |
| --- | --- | --- |
| `bg-mesh-gradient` | **Three-layer** radial gradient — primary 16% top-center, emerald 10% top-right, purple 8% bottom-left | [MeshBackground](../../components/layout/mesh-background.tsx) |
| `noise-overlay` | SVG fractal-noise grain via `data:` URL, 6% opacity, `mix-blend-mode: soft-light` (multiply in light theme at 3.5% opacity) | [MeshBackground](../../components/layout/mesh-background.tsx) — Atmospheric+ pass |
| `glass-card` | `rgba(10,10,10,0.6)` + `backdrop-filter: blur(12px)` + hairline border | Legacy / small surfaces |
| `glass-bento-surface` | Near-opaque vertical gradient + `blur(22px) saturate(150%)` + inset highlight + depth shadow | [BentoCard](../../components/home/bento-card.tsx), featured tile, experience column |
| `glass-strong` | `rgba(10,10,10,0.75)` + `blur(20px)` + heavier border | Phase 5 contact form |
| `text-gradient-fade` | Vertical white→white/60 text clip | Hero `<h1>` on landing + 404 |
| `glow-input` / `glow-input-focused` | Cyan box-shadow on focus-within | Future chat input wrapper |
| `no-scrollbar` (+ `no-scrollbar-webkit`) | Hide scrollbar visuals | Phase 3 experience timeline |
| `.font-tabular` (plain class, not `@utility`) | `font-variant-numeric: tabular-nums` for stable digit columns | Telemetry strips, future timestamps |

Each utility composes with arbitrary variants (`hover:`, `dark:`, `md:`).

## Rules and invariants

- **`<html>` has `suppressHydrationWarning`.** Required by `next-themes` so the SSR `<html class="dark">` and the post-hydration class don't trigger a React mismatch warning.
- **Default class strategy** (`attribute="class"`). The `dark` class lives on `<html>` and is targeted by Tailwind's `dark:` variant via `@custom-variant dark (&:where(.dark, .dark *))` in [app/globals.css](../../app/globals.css).
- **Use semantic Tailwind classes when the surface should swap with the theme.** Use literal `*-dark` / `accent-*` classes when a section is intentionally dark-only or color-anchored.
- **Reduced-motion is global.** [app/globals.css](../../app/globals.css) disables animations system-wide for users with `prefers-reduced-motion: reduce`. Components don't need to handle it individually.
- **Both themes ship together.** A new component must be visually verified in both themes before merging — even if light is "functional only" for now.
- **Two web fonts: Space Grotesk + JetBrains Mono.** Both loaded via `next/font/google` in [app/[locale]/layout.tsx](../../app/[locale]/layout.tsx), bound to `--font-space-grotesk` / `--font-jetbrains-mono` and pulled into `--font-sans` / `--font-mono`. Don't add a third display font without a DESIGN.md update — the pair is the result of the `frontend-design` skill audit (see [docs/phases/phase-2.md](../phases/phase-2.md)).
- **Body opts into Space Grotesk OpenType features.** `kern`, `liga`, and `ss01` are on globally via `body { font-feature-settings: ... }`. Hero `<h1>` adds `ss02` inline for display-weight glyph alternates. Don't override these blindly — they're part of the visual identity.

## Common patterns

### Reading the current theme on the client

```ts
"use client";
import { useTheme } from "next-themes";

const { resolvedTheme, setTheme } = useTheme();
```

`resolvedTheme` is `undefined` on the server. To avoid a hydration mismatch on icons, prefer **CSS-driven** visibility via Tailwind's `dark:` variant — see [components/layout/theme-toggle.tsx](../../components/layout/theme-toggle.tsx) for the no-state pattern. The previous `useEffect` + `useState` approach is forbidden by Next 16's `react-hooks/set-state-in-effect` lint rule.

### Adding a new color token

1. Add the variable to the `@theme` block in [app/globals.css](../../app/globals.css) (this exposes it as a Tailwind class).
2. If the token differs in light mode, add the override under `:root.light`.
3. Update [DESIGN.md](../../DESIGN.md) → Color System table.
4. Update this doc's token map.

### Adding a composite utility

Tailwind v4 `@utility` blocks compose with arbitrary variants. Pattern:

```css
@utility my-thing {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid var(--color-border-dark);
}
```

Used as `class="my-thing hover:opacity-80 md:rounded-2xl"`. Document new utilities in DESIGN.md → Components and in this token map.

## Gotchas

- **The toggle button must not depend on `useState` to gate render.** Doing so triggers `react-hooks/set-state-in-effect`. Render both Sun and Moon icons and switch with `dark:hidden` / `dark:block`.
- **`color-scheme` is set per `<html>` class** (`dark` on `:root`, `light` on `:root.light`). This makes scrollbars and form widgets adopt the correct native palette.
- **Don't put theme-only colors inline.** Even a `style={{ color: "white" }}` will look wrong in light mode. Always go through tokens.
- **Tailwind v4 `@theme` is build-time.** Adding a token requires a dev-server restart for IntelliSense to pick it up.
- **Light theme on landing/home is intentionally minimal polish.** If a card looks washed out in light, that's expected — open a Phase 3+ ticket rather than patching with `dark:` variants in landing components.
