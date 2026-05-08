# Conventions

## What it is / why it exists

Project-wide conventions that apply to every file. The full agent-facing version lives in [AGENTS.md](../../AGENTS.md); this page is the human-readable subset that the docs cross-link to.

## Source of truth

- Agent rules: [AGENTS.md](../../AGENTS.md)
- TypeScript paths: [tsconfig.json](../../tsconfig.json)
- ESLint config: derived from `eslint-config-next` in [package.json](../../package.json)

## Path aliases

Always use `@/` instead of relative parent paths. Configured as `"@/*": ["./*"]` in [tsconfig.json](../../tsconfig.json).

```ts
import { cn } from "@/lib/utils";              // good
import { cn } from "../../../lib/utils";       // bad
```

## File naming

| Asset | Convention | Example |
| --- | --- | --- |
| Routes | `page.tsx`, `layout.tsx`, `route.ts`, `not-found.tsx` (Next.js convention) | [app/[locale]/home/page.tsx](../../app/[locale]/home/page.tsx) |
| Components | kebab-case file, PascalCase export | [components/layout/header.tsx](../../components/layout/header.tsx) |
| Hooks | `use-*.ts`, exporting a `useX` function | (none yet) |
| Types | kebab-case, one domain per file | [types/profile.ts](../../types/profile.ts) |
| Content | `<entity>.<locale>.json` | [content/profile.en.json](../../content/profile.en.json) |
| Docs | kebab-case, sentence-case title | this file |

## Server vs Client Components

Default to **Server Components**. Add `"use client"` only when the file actually needs:

- React hooks (`useState`, `useEffect`, `useTransition`, `useTheme`, …)
- Browser APIs (`window`, `document`, `localStorage`, event listeners)
- DOM event handlers wired to user input

Patterns:

- Read content from JSON via [lib/data.ts](../../lib/data.ts) only inside Server Components. The `import "server-only"` line throws at build if it is ever bundled to the client.
- Don't pass non-serializable values (functions, class instances, `Date` objects in some cases) from Server → Client.
- Push `"use client"` to leaves. Pages and layouts stay server.
- A client island can receive server-rendered children as a prop and render them — see how the locale layout passes `<Header />` (server) inside a server boundary while internal toggle buttons stay client.

## TypeScript

- `strict: true`. Don't downgrade.
- `as` casts are a smell — prefer narrowing functions (`isAppLocale`, etc.).
- Closed unions over `string` for things like locale codes.
- Public types live in [types/](../../types/) when shared across modules; private types stay near the file that uses them.

## Styling

- Tailwind v4 with `@theme` tokens — see [theming.md](theming.md).
- Use the `cn()` helper from [lib/utils.ts](../../lib/utils.ts) when conditionally combining classes.
- No inline styles for colors or spacing — always Tailwind classes.

## Imports order (suggested, ESLint-friendly)

1. Node built-ins (`node:path`)
2. Third-party packages (`react`, `next`, `next-intl`, `lucide-react`, …)
3. Internal `@/` imports
4. Sibling relative imports (only inside the same folder)

## Quality gates

Before committing:

```bash
npm run lint
npm run typecheck
npm run build
```

CI runs the same trio — see [ci-cd.md](ci-cd.md).

## Don'ts

- Don't add a backend service (Postgres, Express, …). Content stays in [content/](../../content/).
- Don't bypass [i18n/navigation.ts](../../i18n/navigation.ts) for in-app links.
- Don't import server-only modules from any `"use client"` file.
- Don't add new fonts before [DESIGN.md](../../DESIGN.md) is filled in.
- Don't commit `.env.local`.
- Don't render emojis as UI icons — use `lucide-react`.
