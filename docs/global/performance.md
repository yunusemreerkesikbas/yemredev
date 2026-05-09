# Performance

## What it is / why it exists

The performance contract for `yemredev.com`. Personal portfolios get judged on first-paint speed and on whether the AI assistant streams smoothly. The full per-rule cribsheet lives in `.agents/skills/vercel-react-best-practices/`. This page is the short list of rules we actively enforce.

## Source of truth

- React/Next perf rules: [`.agents/skills/vercel-react-best-practices/`](../../.agents/skills/vercel-react-best-practices/)
- Server-only loaders: [lib/data.ts](../../lib/data.ts)
- Tailwind v4 token sheet: [app/globals.css](../../app/globals.css)
- Build output: run `npm run build`

## Performance budget

| Metric | Target | Where it's measured |
| --- | --- | --- |
| Lighthouse Performance (mobile) | ≥ 95 | Local Lighthouse run |
| LCP (4G) | ≤ 2.0 s | Web Vitals on landing |
| CLS | < 0.05 | Web Vitals globally |
| Total JS shipped on landing | ≤ 100 KB gzip (excludes Phase 6 AI SDK) | `npm run build` route summary |

Budget is reviewed before every phase ships.

## Rules and invariants

1. **Server Components by default.** No client component fetches data. Move data calls up to the nearest Server Component and pass props down.
2. **`react.cache` for module-scope reads.** Loaders in [lib/data.ts](../../lib/data.ts) are wrapped so a single request is deduplicated even if multiple components ask.
3. **No request waterfalls.** Independent `await` calls run via `Promise.all`. (Reference: `async-parallel`.)
4. **No shared mutable module state in server code.** Use request-scoped helpers. (Reference: `server-no-shared-module-state`.)
5. **Defer below-the-fold work** with `next/dynamic` (carousel, AI chat shell, charts).
6. **Hoist regexes and constants** out of render bodies. (Reference: `js-hoist-regexp`.)
7. **Stable list keys.** Never use array index when items can reorder.
8. **Use `transform` / `opacity` for animations.** Don't animate `width`, `height`, `top`, `left`, or any property that triggers layout.
9. **Reserve image dimensions** with `width`/`height` or `fill` + `aspect-ratio` to keep CLS low.
10. **Suspense boundaries** wrap async sub-trees so the rest of the page streams.

## Common patterns

### Cached server loader

```ts
// lib/data.ts
import "server-only";
import { cache } from "react";

export const getProfile = cache((locale: AppLocale): Profile => {
  return profileByLocale[locale];
});
```

Calling `getProfile("en")` from a layout and again from a page in the same request is a single read.

### Parallel data fetches

```ts
const [profile, projects] = await Promise.all([
  getProfile(locale),
  getProjects(locale),
]);
```

### Dynamic-import a heavy island

```ts
import dynamic from "next/dynamic";
const ProjectsCarousel = dynamic(() => import("./projects-carousel"));
```

(Phase 4 will use this for the carousel at `/{locale}/projects` once a library is chosen.)

### Streaming with Suspense

```tsx
<Suspense fallback={<ProjectListSkeleton />}>
  <ProjectList locale={locale} />
</Suspense>
```

The header and hero render immediately; the project list streams in.

## Gotchas

- **Tailwind v4 is build-time.** Don't ship CSS-in-JS for theming — it bypasses the cascade and bloats JS.
- **`next/font` adds bytes.** Preload only the display + body fonts. Variable fonts when available. (Decisions deferred until [DESIGN.md](../../DESIGN.md) is filled.)
- **Edge runtime disables ISR for that route.** `/api/chat` is on `runtime = "edge"` for streaming but the build output reminds you that page-level edge usage forces dynamic rendering.
- **Static generation depends on `setRequestLocale`.** Forgetting it on a page silently flips the page to dynamic rendering — the build output will mark it `ƒ` instead of `●`.
- **Multiple lockfiles** in parent dirs cause Turbopack to misroot. Pinned in [next.config.ts](../../next.config.ts) via `turbopack.root`.
