# Phase 3 — Home / Bento Dashboard

> **Status:** Shipped. Single-viewport bento dashboard renders at `/{locale}/home` with placeholder content. Real bio / projects / OSS data lands in a follow-up turn without touching components.

## Locked-in decisions

| Topic | Decision | Why |
| --- | --- | --- |
| Variant | **Hybrid: v3 6-cell topology + v1 mockup-forward hero + v2 "View all projects" affordance** | v3 has the cleanest bento that respects DESIGN.md's "only Experience scrolls" rule. v1's mockup-forward hero reads more senior than v2's project list. v2's "View All" survives as a single CTA on the featured tile → `/projects`. |
| Route rename | `/portfolio` → `/projects`. `/home` (bento) stays. | Cleanest hierarchy with least string churn (option C). Skip CTA copy goes neutral: "Skip Intro" / "Girişi atla". `AppHeader` nav: Home / Projects / Contact. Closes the open question from [phase-2.md](phase-2.md). |
| Data | Ship Phase 3 with **placeholder JSON** + new types/loaders; real bio/projects/OSS arrive next turn. | Keeps Phase 3 scope = UI + structure only. |
| Mobile | DESIGN.md's "no page scroll" rule applies **desktop only** (`lg+`). Below `lg` the bento collapses to `grid-cols-1` and page scroll is permitted. | Otherwise mobile content is unreachable. The subagent flagged this as the only spec violation across all three reference variants. |
| Featured project link target | `/{locale}/projects` (Phase 4 placeholder until carousel ships) | One CTA target across all "View Project" / "View All" affordances; Phase 4 swaps the page in place. |
| Card composition | Each card carries its own `lg:col-start-* / lg:row-start-*` classes; [`BentoGrid`](../../components/home/bento-grid.tsx) is pure layout (no positional logic). | JSX order can stay mobile-natural (Status → Featured → Tech → Experience → OSS → CTA) while desktop placement is explicit. No reliance on grid-auto-flow ordering. |
| Single primary CTA | "Get in Touch" inside `EducationCTA` — only conversion target on the dashboard. | Avoids competing CTAs. The featured tile's "View Project" is positioned as navigation (it goes to `/projects`, not contact). |
| Empty placeholder cells | Dropped from v1/v2 — no "Coming Soon" tiles. | Reads more "dashboard", less "WIP". Subagent recommendation, accepted. |
| OSS data shape | New `OpenSourceProject` type lives on `Profile.openSource` (optional). Loader: `getOpenSource(locale)` returns `[]` when missing. | One data source per concept. Existing project data stays in `projects.{en,tr}.json`. |
| Project type extension | Existing `Project` gains optional `status` ("live" \| "wip" \| "archived") and `category` ("saas" \| "tool" \| "open-source" \| "client"). | Drives the featured card's status dot + category-tinted hover wash. Optional → no migration burden. |

## Deliverables

### Routes
- New: [app/[locale]/projects/page.tsx](../../app/%5Blocale%5D/projects/page.tsx). Placeholder body, "Coming in Phase 4". `AppHeader` + `MeshBackground withCornerAccents`.
- Removed: `app/[locale]/portfolio/page.tsx`.
- Rewritten: [app/[locale]/home/page.tsx](../../app/%5Blocale%5D/home/page.tsx). `AppHeader` + `MeshBackground withCornerAccents` + `BentoGrid` composing all six cards + `FloatingAssistantFab`.

### Components (`components/home/`)
- [`bento-grid.tsx`](../../components/home/bento-grid.tsx) — wrapper, `grid-cols-1 gap-4 lg:grid-cols-4 lg:grid-rows-6`.
- [`bento-card.tsx`](../../components/home/bento-card.tsx) — shared shell (glass + hairline + rounded-2xl).
- [`status-block.tsx`](../../components/home/status-block.tsx) (1×2)
- [`featured-project.tsx`](../../components/home/featured-project.tsx) (2×4) — whole tile is `<Link href="/projects">`; CSS-skeleton browser-chrome mockup inside.
- [`tech-stack.tsx`](../../components/home/tech-stack.tsx) (1×4) — three groups, semantic `<ul>`.
- [`experience-timeline.tsx`](../../components/home/experience-timeline.tsx) (1×4) — only card with internal scroll. Sticky inner header, `<ol>` + `<time>`.
- [`open-source-highlight.tsx`](../../components/home/open-source-highlight.tsx) (2×2) — stars/forks/repo via lucide.
- [`education-cta.tsx`](../../components/home/education-cta.tsx) (1×2) — single primary "Get in Touch" CTA → `/contact`.
- [`floating-assistant-fab.tsx`](../../components/home/floating-assistant-fab.tsx) — bottom-right, inverse of Skip Intro, hidden on `<sm`.

### Data layer
- [types/project.ts](../../types/project.ts) — added optional `status` + `category`, plus the named `ProjectStatus` / `ProjectCategory` types.
- [types/open-source.ts](../../types/open-source.ts) — **new**, `OpenSourceProject` type.
- [types/profile.ts](../../types/profile.ts) — added optional `availability: { available, label }` and `openSource?: OpenSourceProject[]`.
- [content/profile.{en,tr}.json](../../content/profile.en.json) — added `availability` + `openSource` placeholders.
- [content/projects.{en,tr}.json](../../content/projects.en.json) — added two placeholder projects (Nebula Analytics, Chronos AI) + enriched yemredev.com entry with `status` + `category`.
- [lib/data.ts](../../lib/data.ts) — new cached loaders `getFeaturedProject(locale)` + `getOpenSource(locale)`.

### i18n
- [messages/{en,tr}.json](../../messages/en.json) — full `home.*` namespace replaced the 2-key stub. `appHeader.nav.portfolio` renamed → `appHeader.nav.projects`. `landing.header.skip` copy went neutral. Old `portfolio.*` namespace renamed → `projects.*`.

### Docs
- [DESIGN.md §7.2](../../DESIGN.md) — full bento spec table + projects-rename note in §7.3.
- [docs/modules/home-page.md](../modules/home-page.md) — **new**, mirrors `landing-page.md` format.
- [docs/global/conventions.md](../global/conventions.md) — `/projects` is canonical; `/portfolio` retired.
- [phase-2.md](phase-2.md) — closed the `/home` ↔ `/portfolio` open question.

## Verification

| Check | Expected | Actual |
| --- | --- | --- |
| `npm run lint` | 0 warnings | _filled by verify step_ |
| `npm run typecheck` | 0 errors | _filled by verify step_ |
| `npm run build` | 14 SSG pages (was 12; +`/{en,tr}/projects` replacing `/{en,tr}/portfolio` net = same; bento adds nothing) | _filled by verify step_ |
| HTTP smoke | `/en/home`, `/tr/home`, `/en/projects`, `/tr/projects` → 200 | _filled by verify step_ |
| HTML markers | bento grid present, status dot, mockup, tech stack list, experience `<ol>`, OSS card, education CTA | _filled by verify step_ |
| Manual desktop ≥ 1440×900 | no page scroll; only Experience card scrolls internally | _manual_ |
| Manual mobile 375 | stacked single-column accordion; page scroll permitted | _manual_ |
| Reduced-motion | pulses + skeleton-pulse halt, hover lifts neutralised | _manual_ |

## Out of scope (deferred)

- Real project content / OSS data → next turn after this phase.
- Phase 4 carousel implementation at `/projects/[slug]`.
- AI Assistant FAB onClick — still routes to `/{locale}` landing, no chat-widget overlay yet (Phase 6).
- GitHub live stats (stars/contributions) — would require a runtime fetch + ISR; defer to a "real data" pass.
