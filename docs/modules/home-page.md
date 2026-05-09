# Home Page (Bento Dashboard)

## Purpose

The home dashboard at `/{locale}/home` is the **single-viewport at-a-glance** view of who Yemre is, what he ships, and how to reach him. It is the destination of the landing's "Skip Intro" CTA and the canonical landing surface for any link off the AI assistant.

Phase 3 ships **placeholder content** (Nebula Analytics-style fake projects, TBD bio, etc.) to validate layout + composition. Real content is loaded into the JSON files in a follow-up turn without touching components.

## Source of truth

- Page composition: [app/[locale]/home/page.tsx](../../app/%5Blocale%5D/home/page.tsx)
- Header variant: [components/layout/app-header.tsx](../../components/layout/app-header.tsx)
- Background atmosphere: [components/layout/mesh-background.tsx](../../components/layout/mesh-background.tsx) (with `withCornerAccents`)
- Bento wrapper: [components/home/bento-grid.tsx](../../components/home/bento-grid.tsx)
- Card shell: [components/home/bento-card.tsx](../../components/home/bento-card.tsx)
- Cards:
  - [components/home/status-block.tsx](../../components/home/status-block.tsx)
  - [components/home/featured-project.tsx](../../components/home/featured-project.tsx)
  - [components/home/tech-stack.tsx](../../components/home/tech-stack.tsx)
  - [components/home/experience-timeline.tsx](../../components/home/experience-timeline.tsx)
  - [components/home/open-source-highlight.tsx](../../components/home/open-source-highlight.tsx)
  - [components/home/education-cta.tsx](../../components/home/education-cta.tsx)
  - [components/home/floating-assistant-fab.tsx](../../components/home/floating-assistant-fab.tsx)
- String catalog: `home.*` keys in [messages/en.json](../../messages/en.json) / [messages/tr.json](../../messages/tr.json)
- Data loaders: `getProfile` / `getFeaturedProject` / `getOpenSource` in [lib/data.ts](../../lib/data.ts)
- Content: [content/profile.{en,tr}.json](../../content/profile.en.json), [content/projects.{en,tr}.json](../../content/projects.en.json)

## Anatomy

```
                                                            FAB
 ┌──────────────────────┬─────────────────────────────┬──────────┐
 │                      │                             │          │
 │    StatusBlock       │       FeaturedProject       │          │
 │       (1×2)          │           (2×4)             │ Experience
 │                      │                             │ Timeline │
 ├──────────────────────┤                             │  (1×4)   │
 │                      │                             │          │
 │     TechStack        │                             │          │
 │       (1×4)          │                             │          │
 │                      ├─────────────────────────────┼──────────┤
 │                      │                             │          │
 │                      │     OpenSourceHighlight     │ Education│
 │                      │           (2×2)             │   + CTA  │
 │                      │                             │   (1×2)  │
 └──────────────────────┴─────────────────────────────┴──────────┘
                                                            ^ inverse
                                                              of Skip Intro
```

## Sub-component contracts

| Component | Props | Notes |
| --- | --- | --- |
| `StatusBlock` | `profile: Profile` | Avatar/initials + name + title + tagline + optional `availability` chip + location + social icons. |
| `FeaturedProject` | `project: Project \| null` | Whole tile is `<Link href="/projects">`. Renders an empty-state `<section>` if no project. |
| `TechStack` | `skills: SkillGroup[]` | Localised group headers via `home.techStack.groups.{languages,frameworks,tools}`. Falls back to source label for unknown groups. |
| `ExperienceTimeline` | `experience: Experience[]` | Sticky inner header + `overflow-y-auto no-scrollbar`. **Only card with internal scroll.** |
| `OpenSourceHighlight` | `project: OpenSourceProject \| null` | Decorative blur orb tinted by `project.primaryColor` token. Stars/forks via lucide. |
| `EducationCTA` | `education: Education[]` | Education list above the **single primary "Get in Touch" CTA → `/contact`**. |
| `FloatingAssistantFab` | _none_ | Routes to `/{locale}` (landing). Hidden on `<sm`. |

## Rules

- **Single primary CTA.** "Get in Touch" inside `EducationCTA` is the home page's only conversion target. The featured tile's "View Project" is a navigation aid (it goes to `/projects`, not a conversion).
- **Only the experience card scrolls.** Every other card must fit its content at default desktop heights. If a future card grows past its cell on a typical viewport, the answer is to redesign the card, not to add `overflow-y-auto` elsewhere.
- **Mobile collapse to single column.** Below `lg` the grid is `grid-cols-1` and the page regains scroll. The desktop "no scroll" rule is desktop-only by design (DESIGN.md §7.2).
- **Server components only.** No card needs client state. The page's only client islands are inherited from `AppHeader` (`LanguageSwitcher`, `ThemeToggle`).
- **Position classes live in the card, not the grid.** Each card root carries its own `lg:col-start-* / lg:row-start-*` classes so the JSX order can stay mobile-natural without extra wrapper divs in [`BentoGrid`](../../components/home/bento-grid.tsx).
- **Empty-state friendly.** `FeaturedProject` + `OpenSourceHighlight` handle `null` data — the bento always renders, even with sparse JSON.
- **No new keyframes.** Reuses `animate-pulse-slow` (status dots) and the existing skeleton pulse from the landing's input bar's emerald dot pattern. Hover lifts use `transform`/`opacity` only (compositor-safe).

## Data shape

`Profile` was extended in Phase 3 with optional `availability` and `openSource` fields — see [types/profile.ts](../../types/profile.ts) and [types/open-source.ts](../../types/open-source.ts). `Project` gained optional `status` ("live" | "wip" | "archived") and `category` ("saas" | "tool" | "open-source" | "client") — see [types/project.ts](../../types/project.ts). All new fields are optional so existing data does not need to be migrated.

## Adding a new bento cell

1. Add the new component to `components/home/`.
2. Hard-code its `lg:col-start-*` / `lg:row-start-*` / `lg:col-span-*` / `lg:row-span-*` classes on the root.
3. Make sure the new cell does not overlap an existing one in the 4×6 grid (24-cell budget, current usage = 24 — adding cells requires reflowing).
4. Add a row to the table in [DESIGN.md](../../DESIGN.md) §7.2.
5. Update the anatomy diagram and contracts table above.
