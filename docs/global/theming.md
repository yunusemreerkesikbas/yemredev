# Theming

## What it is / why it exists

Two themes: **dark** (default) and **light**. The active theme is stored in `localStorage` (key: `theme`) by [next-themes](https://github.com/pacocoursey/next-themes) and applied as a class on `<html>` (`dark` or absent). All colors are CSS variables defined as Tailwind v4 `@theme` tokens, so components only ever consume **semantic** classes (`bg-background`, `text-foreground`, etc.).

`enableSystem` is `false` — the user's OS preference is intentionally ignored so the experience is dark-first across visits.

## Source of truth

- Token sheet: [app/globals.css](../../app/globals.css)
- Provider wrapper: [components/providers/theme-provider.tsx](../../components/providers/theme-provider.tsx)
- Provider mount: [app/[locale]/layout.tsx](../../app/[locale]/layout.tsx)
- Toggle button: [components/layout/theme-toggle.tsx](../../components/layout/theme-toggle.tsx)

## Token map

| Token | Dark (default) | Light | Tailwind class |
| --- | --- | --- | --- |
| `--color-background` | `oklch(0.14 0 0)` | `oklch(0.99 0 0)` | `bg-background` |
| `--color-foreground` | `oklch(0.96 0 0)` | `oklch(0.18 0 0)` | `text-foreground`, `border-foreground/*` |
| `--color-accent` | `oklch(0.72 0.18 252)` | _TBD_ | `bg-accent`, `text-accent` |
| `--color-accent-foreground` | `oklch(0.14 0 0)` | _TBD_ | `text-accent-foreground` |
| `--font-sans` | system stack | system stack | `font-sans` (default) |
| `--font-mono` | system stack | system stack | `font-mono` |

These values are placeholders pending the design example. They will be replaced once [DESIGN.md](../../DESIGN.md) is filled in. See the canonical design system in [DESIGN.md](../../DESIGN.md).

## Rules and invariants

- **`<html>` has `suppressHydrationWarning`.** Required by `next-themes` so the SSR `<html class="dark">` and the post-hydration class don't trigger a React mismatch warning.
- **Default class strategy** (`attribute="class"`). The `dark` class lives on `<html>` and is targeted by Tailwind's `dark:` variant via `@custom-variant dark (&:where(.dark, .dark *))` in [app/globals.css](../../app/globals.css).
- **Use semantic Tailwind classes only.** No raw `bg-zinc-*`, `text-white`, or hex codes in components — always reference tokens.
- **Reduced-motion is global.** [app/globals.css](../../app/globals.css) disables animations system-wide for users with `prefers-reduced-motion: reduce`. Components don't need to handle it individually.
- **Both themes ship together.** A new component must be visually verified in both themes before merging.

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

## Gotchas

- **The toggle button must not depend on `useState` to gate render.** Doing so triggers `react-hooks/set-state-in-effect`. Render both Sun and Moon icons and switch with `dark:hidden` / `dark:block`.
- **`color-scheme` is set per `<html>` class** (`dark` on `:root`, `light` on `:root.light`). This makes scrollbars and form widgets adopt the correct native palette.
- **Don't put theme-only colors inline.** Even a `style={{ color: "white" }}` will look wrong in light mode. Always go through tokens.
- **Tailwind v4 `@theme` is build-time.** Adding a token requires a dev-server restart for IntelliSense to pick it up.
