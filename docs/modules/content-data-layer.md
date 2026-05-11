# Content Data Layer

## Purpose

All portfolio content (profile, education, experience, skills, projects) is shipped as static JSON, one file per entity per locale. A thin server-only loader exposes typed helpers and dedupes reads within a single request via `react.cache`.

There is no database, no CMS, and no API. Editing content == editing JSON + a redeploy.

## Source of truth

- Loaders: [lib/data.ts](../../lib/data.ts)
- Types:
  - [types/profile.ts](../../types/profile.ts)
  - [types/project.ts](../../types/project.ts)
  - [types/open-source.ts](../../types/open-source.ts)
- Content files:
  - [content/profile.en.json](../../content/profile.en.json)
  - [content/profile.tr.json](../../content/profile.tr.json)
  - [content/projects.en.json](../../content/projects.en.json)
  - [content/projects.tr.json](../../content/projects.tr.json)

## Type contracts

`Profile` ([types/profile.ts](../../types/profile.ts)):

| Field | Type | Notes |
| --- | --- | --- |
| `name`, `initials`, `title`, `tagline`, `bio`, `location` | `string` | Free text. `initials` powers `AppHeader` + `StatusBlock`. |
| `avatar` | `string?` | Public asset path |
| `availability` | `Availability?` | `{ available, label }`. Drives the home `StatusBlock` availability dot. |
| `social` | `SocialLink[]` | `platform` is a closed union |
| `education` | `Education[]` | `end` may be `"present"` |
| `experience` | `Experience[]` | `highlights` is bullet list, `stack` optional |
| `skills` | `SkillGroup[]` | grouped lists |
| `personal` | `ProfilePersonal?` | Optional soft facts for the chat assistant only — keys: `languages`, `hobbies`, `currentlyLearning`, `community`, `workValues`, `personality`, `certifications`, `freelancePreferences` (all optional strings). Omitted keys or empty strings are not sent to the model. Not landing chips. |
| `openSource` | `OpenSourceProject[]?` | One-shot OSS contribution list, surfaced by the home `OpenSourceHighlight` card. |

`Project` ([types/project.ts](../../types/project.ts)):

| Field | Type | Notes |
| --- | --- | --- |
| `slug` | `string` | **Must match across locales** |
| `title`, `summary`, `description`, `role` | `string` | Localized text |
| `year` | `number` | Used for sort |
| `client`, `cover`, `gallery` | optional | |
| `stack` | `string[]` | Tech labels |
| `links` | `ProjectLink[]` | `type` is `"live" \| "repo" \| "case-study" \| "demo"` |
| `featured` | `boolean` | Drives `getFeaturedProject`. |
| `status` | `ProjectStatus?` | `"live" \| "wip" \| "archived"`. Drives the home `FeaturedProject` status dot. |
| `category` | `ProjectCategory?` | `"saas" \| "tool" \| "open-source" \| "client"`. Tints the featured tile's hover wash. |

`OpenSourceProject` ([types/open-source.ts](../../types/open-source.ts)):

| Field | Type | Notes |
| --- | --- | --- |
| `name`, `description`, `language` | `string` | Localized text |
| `repo` | `string` | External repo URL |
| `stars`, `forks` | `number` | Static numbers — no runtime fetch (deferred) |
| `primaryColor` | `"primary" \| "emerald" \| "purple" \| "amber"` (optional) | Tints the OSS card's corner blur orb. |

## Loader API

All loaders are wrapped in `react.cache` so a single request reads each JSON only once even if multiple components ask.

```ts
import {
  getProfile,
  getProjects,
  getProject,
  getFeaturedProject,
  getOpenSource,
} from "@/lib/data";

const profile = getProfile(locale);                       // Profile
const projects = getProjects(locale);                     // Project[]
const project = getProject(locale, "yemredev-portfolio"); // Project | undefined
const featured = getFeaturedProject(locale);              // Project | null
const oss = getOpenSource(locale);                        // OpenSourceProject[]
```

The loaders are **synchronous** — JSON is bundled at build time, not fetched.

## Rules and invariants

- **`server-only` import is mandatory** at the top of [lib/data.ts](../../lib/data.ts). Importing the module from a `"use client"` file throws at build.
- **Same `slug` in both locale project files.** [lib/data.ts](../../lib/data.ts) keys lookups by slug; a mismatch silently breaks one locale.
- **JSON shape must match the TS types.** TypeScript validates this at build time via the cast in [lib/data.ts](../../lib/data.ts).
- **No write paths.** There is no setter, no API, no admin panel.

## Frontend integration

Server Components only. Example:

```tsx
import { getProfile } from "@/lib/data";

export default async function HomePage({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params;
  const profile = getProfile(locale);
  return <h1>{profile.name}</h1>;
}
```

For client components that need a slice of profile data, **fetch it in the parent server component and pass the slice as a prop**. Don't try to import the loader from a client file.

The projects carousel follows the same rule: [`app/[locale]/projects/page.tsx`](../../app/%5Blocale%5D/projects/page.tsx) calls `getProjects(locale)` and passes serializable project data into server `ProjectSlide` children; only [`ProjectsCarousel`](../../components/projects/projects-carousel.tsx) is client-side for scroll controls.

## Implementation guide

### Adding a new project

1. Pick a slug (kebab-case, lowercase).
2. Add an entry with that slug to [content/projects.en.json](../../content/projects.en.json) and [content/projects.tr.json](../../content/projects.tr.json).
3. Verify both files match the [Project](../../types/project.ts) shape (`tsc --noEmit` will catch most issues).
4. Drop image assets into [public/](../../public/) and reference them as `/...` in `cover` / `gallery`.

### Adding a new content entity

1. Add the type to [types/](../../types/).
2. Add `<entity>.<locale>.json` files to [content/](../../content/).
3. Extend [lib/data.ts](../../lib/data.ts) with a `react.cache`-wrapped loader.
4. Document the new entity in this file.

### Renaming a field

1. Update the type in [types/](../../types/).
2. Update **all** locale JSON files in [content/](../../content/).
3. Update every consumer site-wide.
4. Run `npm run typecheck` to confirm coverage.

## Gotchas

- **JSON imports are typed as `unknown` by default in strict mode.** [lib/data.ts](../../lib/data.ts) casts them to the typed shape — be careful that the JSON actually matches.
- **`react.cache` scope is per-request.** Mutating the returned objects is forbidden — they are shared across all components in the same request.
- **Project ordering** is currently insertion order in the JSON. If you need a different order, sort inside [lib/data.ts](../../lib/data.ts) (`featured` first, then `year` desc) so all consumers agree.
- **Localized URLs in social links** — `mailto:` is locale-agnostic; if you ever need a localized website link, encode the locale in the URL path, not in the loader.
- **`Profile.openSource` star/fork counts** are static in JSON — refresh them manually when you want the home OSS card to reflect GitHub; there is no runtime fetch yet (see [types/open-source.ts](../../types/open-source.ts)).
