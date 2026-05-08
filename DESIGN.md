# DESIGN.md

Visual design system for **yemredev.com**.

> **Status: SKELETON.** Each section below is intentionally a placeholder. Once the design example is shared, every TBD block is filled in and the corresponding values are mirrored into [app/globals.css](app/globals.css), font setup, and Tailwind tokens. Do not implement final visuals until this file is filled in.

## 1. Aesthetic Direction

> **TBD — awaiting design example.**

Once decided, capture:

- One-line aesthetic statement (e.g. _"editorial minimal with mono accents"_)
- Reference images / inspiration links
- Tone keywords (3–5)
- What to avoid (anti-references)

## 2. Color System

> **TBD — awaiting design example.**

Token table (placeholders match the values currently in [app/globals.css](app/globals.css)):

| Token | Dark (default) | Light | Usage |
| --- | --- | --- | --- |
| `--color-background` | `oklch(0.14 0 0)` | `oklch(0.99 0 0)` | Page background |
| `--color-foreground` | `oklch(0.96 0 0)` | `oklch(0.18 0 0)` | Primary text / icons |
| `--color-accent` | `oklch(0.72 0.18 252)` | _TBD_ | Primary CTA, highlights |
| `--color-accent-foreground` | `oklch(0.14 0 0)` | _TBD_ | Text on accent |
| `--color-muted` | _TBD_ | _TBD_ | Secondary surfaces |
| `--color-muted-foreground` | _TBD_ | _TBD_ | Secondary text |
| `--color-border` | _TBD_ | _TBD_ | Hairlines, dividers |
| `--color-success` | _TBD_ | _TBD_ | Form success state |
| `--color-danger` | _TBD_ | _TBD_ | Form errors, destructive |

Contrast verification (WCAG):

- [ ] `foreground` on `background` ≥ 4.5:1 in both themes
- [ ] `accent-foreground` on `accent` ≥ 4.5:1 in both themes
- [ ] Border tokens still visible against background in both themes

## 3. Typography

> **TBD — awaiting design example.**

| Role | Font | Weight | Size | Line height |
| --- | --- | --- | --- | --- |
| Display (hero) | _TBD_ | _TBD_ | _TBD_ | _TBD_ |
| Heading | _TBD_ | _TBD_ | _TBD_ | _TBD_ |
| Body | _TBD_ | _TBD_ | 16px | 1.5–1.7 |
| Small / caption | _TBD_ | _TBD_ | 13–14px | 1.5 |
| Mono / code | _TBD_ | _TBD_ | _TBD_ | _TBD_ |

Loading: use `next/font/google` with `display: "swap"`. Preload only the display + body fonts. Update [app/layout.tsx](app/layout.tsx) once chosen.

## 4. Spacing & Layout

> **TBD — awaiting design example.**

- Base unit: 4px
- Container max-width: _TBD_ (Phase 1 uses `max-w-6xl` placeholder in the header)
- Grid: _TBD_
- Section rhythm: _TBD_
- Safe-area handling for mobile: _TBD_

## 5. Motion

> **TBD — awaiting design example.**

- Default duration: 150–250ms (micro), ≤400ms (page transitions)
- Default easing: _TBD_
- Spring vs cubic-bezier: _TBD_
- Respect `prefers-reduced-motion` (already wired globally in [app/globals.css](app/globals.css))

## 6. Components

For each component, define: **states** (default / hover / active / focus / disabled), **sizing**, **radius**, **elevation**.

- **Button** — primary, secondary, ghost: _TBD_
- **Input / Textarea** — text, focus ring, error: _TBD_
- **Card** — surface, hairline, hover: _TBD_
- **Badge / Chip** — for skills & tags: _TBD_
- **Carousel arrows / dots** — Phase 4: _TBD_
- **Toast** — Phase 5: _TBD_

## 7. Per-Page Layouts

### 7.1 Landing — AI Assistant (Phase 2)

> **TBD.** Skeleton in [app/[locale]/page.tsx](app/[locale]/page.tsx).

- Full-viewport hero
- `Skip portfolio` button at top-right (already placed)
- Centered chat input with send action
- Streaming response area below the input

### 7.2 Home — Single-Screen Overview (Phase 3)

> **TBD.** Hard requirement: **no vertical scroll, no follow-on page**. Education + experience + skills must fit one viewport on a 1280×800 desktop and on a typical mobile (375×667 → may collapse via accordion / tabs).

### 7.3 Portfolio Detail Carousel (Phase 4)

> **TBD.** Slider with project cards. Library candidate: Embla Carousel.

### 7.4 Contact (Phase 5)

> **TBD.** Form fields: name, email, message. Inline validation. Provider TBD.

## 8. Accessibility Checklist (must hold for every screen)

- [ ] Body text contrast ≥ 4.5:1
- [ ] Visible `:focus-visible` ring on every interactive element
- [ ] All interactive elements ≥ 44×44 px touch target
- [ ] Icon-only buttons have `aria-label`
- [ ] No information conveyed by color alone
- [ ] Reduced-motion respected (animations disabled)
- [ ] Both themes audited independently
- [ ] Tab order matches visual order

## 9. Performance Budget

- Lighthouse Performance ≥ 95 (mobile)
- LCP ≤ 2.0s on 4G (target image: hero)
- CLS < 0.05 (reserve image dimensions, font swap)
- Total JS shipped on landing ≤ 100 KB gzipped (excluding AI SDK in Phase 6)

## 10. Open Questions

- Which font pair? _(blocked on design example)_
- Accent color hue? _(blocked on design example)_
- Carousel UX: arrows + dots, drag, snap? _(Phase 4)_
- Contact form layout: single column vs split? _(Phase 5)_
