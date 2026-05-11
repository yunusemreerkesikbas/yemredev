# CI/CD

## What it is / why it exists

Two GitHub Actions workflows cover quality and deployment:

- **CI** (`ci.yml`) — runs lint, typecheck, and build on every push/PR to `master`.
- **Deploy** (`deploy.yml`) — builds and deploys to Cloudflare Workers on manual trigger (`workflow_dispatch`).

See [3rd-party/hosting.md](../3rd-party/hosting.md) for the full deployment setup.

## Source of truth

- CI workflow: [.github/workflows/ci.yml](../../.github/workflows/ci.yml)
- Deploy workflow: [.github/workflows/deploy.yml](../../.github/workflows/deploy.yml)
- npm scripts: [package.json](../../package.json)
- Lockfile: [package-lock.json](../../package-lock.json)

## CI workflow shape

| Stage | Command | Purpose |
| --- | --- | --- |
| Checkout | `actions/checkout@v4` | Pull repo |
| Setup | `actions/setup-node@v4` (Node 22, npm cache) | Reproducible toolchain |
| Install | `npm ci` | Clean install from lockfile |
| Lint | `npm run lint` | ESLint via `eslint-config-next` |
| Typecheck | `npm run typecheck` (`tsc --noEmit`) | Strict TS verification |
| Build | `npm run build` | Production build (Turbopack) |

Triggers: `push` to `master`, `pull_request` to `master`.

`concurrency: cancel-in-progress` cancels superseded runs on the same branch / PR.

## Deploy workflow shape

| Stage | Command | Purpose |
| --- | --- | --- |
| Checkout | `actions/checkout@v4` | Pull repo |
| Setup | `actions/setup-node@v4` (Node 22, npm cache) | Reproducible toolchain |
| Install | `npm ci` | Clean install from lockfile |
| Build | `npm run cf:build` | opennextjs/cloudflare build into `.open-next/` |
| Deploy Worker | `npx wrangler deploy --config wrangler.jsonc` | Uploads Worker to Cloudflare |
| Sync secrets | `echo "$VAR" \| npx wrangler secret put VAR --name yemredev` | Pushes secrets to Worker (×3) |

Trigger: `workflow_dispatch` only (manual via GitHub Actions UI → Run workflow).

Required GitHub Actions secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `OPENAI_API_KEY`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`.

## Rules and invariants

- **Node version is pinned to 22.x** in both workflows — Wrangler requires ≥22.
- **`npm ci` only** — never `npm install` (it can mutate the lockfile).
- **All three CI checks must pass** before merge.
- **`NEXT_TELEMETRY_DISABLED=1`** is set in the deploy build step so logs stay clean.

## Common patterns

### Mirroring CI locally

```bash
npm ci
npm run lint
npm run typecheck
npm run build
```

### Triggering a deploy

GitHub → Actions → **Deploy** → **Run workflow** → branch `master`.

### Adding a new check

1. Add the npm script to [package.json](../../package.json).
2. Add a step to [.github/workflows/ci.yml](../../.github/workflows/ci.yml) after the existing checks.

## Gotchas

- **Stale `.next` between local runs after route restructures** can mask CI failures. CI does a clean build; mirror by deleting `.next/` before retrying locally.
- **Lockfile drift** — if you add a dependency without updating the lockfile, `npm ci` will fail. Always commit the updated `package-lock.json`.
- **Workflow concurrency cancels in-flight runs.** If you see "Canceled" on an older PR commit, that's expected.
- **`wrangler secret bulk` hangs** — the deploy workflow uses `echo "$VAR" | wrangler secret put` per secret instead of `secret bulk` to avoid stdin blocking.
