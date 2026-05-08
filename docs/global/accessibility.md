# Accessibility

## What it is / why it exists

Baseline rules that every screen on `yemredev.com` must satisfy. The list is intentionally short — it captures only the rules we actively enforce in code review. Detailed per-page checks live in the corresponding `modules/` doc.

## Source of truth

- Reduced-motion handling: [app/globals.css](../../app/globals.css)
- Focus / hover / disabled state classes: see component implementations under [components/layout/](../../components/layout/)
- A11y-flavored skill cribsheet: `.agents/skills/ui-ux-pro-max/SKILL.md`

## Rules and invariants

1. **Color contrast ≥ 4.5:1** for body text, ≥ 3:1 for text ≥ 18.66 px or ≥ 24 px bold. Verified independently in **both** themes.
2. **Visible focus indicator on every interactive element.** Use `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40` (or equivalent token-based ring). Don't strip the ring without replacing it.
3. **Touch target ≥ 44 × 44 px** for any tappable control. Use padding or `hitSlop`-style invisible padding when the visible icon is smaller.
4. **Icon-only buttons need `aria-label`.** Pull the label from the message catalog so it is localized — see the pattern in [components/layout/theme-toggle.tsx](../../components/layout/theme-toggle.tsx).
5. **No information conveyed by color alone.** Pair color with an icon or text label.
6. **`prefers-reduced-motion` is honored.** [app/globals.css](../../app/globals.css) disables animations system-wide for users with the preference. Components don't need to guard individually but **must not** override the global rule.
7. **Heading order is sequential.** `h1 → h2 → h3` per page; never skip levels for visual sizing.
8. **Form fields have visible labels** — never placeholder-only labels.
9. **Tab order matches visual order.** Don't add `tabIndex={positive}`.
10. **Keyboard activation** works on every control: `Enter` and `Space` for buttons, `Enter` for links.

## Common patterns

### Localized icon-only button

```tsx
const t = useTranslations("header.theme");

<button type="button" aria-label={t("label")} ...>
  <Sun aria-hidden className="block h-4 w-4 dark:hidden" />
  <Moon aria-hidden className="hidden h-4 w-4 dark:block" />
</button>
```

### Focus ring that respects tokens

```tsx
className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40"
```

### Group control with state announced

```tsx
<div role="group" aria-label={t("label")}>
  <button aria-pressed={active}>EN</button>
  <button aria-pressed={!active}>TR</button>
</div>
```

See [components/layout/language-switcher.tsx](../../components/layout/language-switcher.tsx).

## Gotchas

- **`suppressHydrationWarning` on the toggle** is intentional — the rendered icon depends on the persisted theme, which the server cannot know. Don't remove it.
- **`aria-label` is the localized label**, not the icon name. `aria-label="Sun"` is wrong; `aria-label={t("label")}` (e.g. "Toggle theme" / "Temayı değiştir") is right.
- **Disabling the language switch button during transition** is OK; just keep the `aria-pressed` state correct so screen readers announce the active locale immediately, not after the route resolves.
- **Don't animate the focus ring.** Animating `outline` or `box-shadow` can be missed by users when paired with `prefers-reduced-motion`.
