# CI/CD

## What it is / why it exists

A single GitHub Actions workflow runs on every push and pull request targeting `main`. It enforces lint, type, and build cleanliness — nothing else. Deployment is **not** wired yet (see [3rd-party/hosting.md](../3rd-party/hosting.md)); a `deploy` job will be appended once the host is chosen.

## Source of truth

- Workflow: [.github/workflows/ci.yml](../../.github/workflows/ci.yml)
- npm scripts: [package.json](../../package.json)
- Lockfile: [package-lock.json](../../package-lock.json)

## Workflow shape

| Stage | Command | Purpose |
| --- | --- | --- |
| Checkout | `actions/checkout@v4` | Pull repo |
| Setup | `actions/setup-node@v4` (Node 20, npm cache) | Reproducible toolchain |
| Install | `npm ci` | Clean install from lockfile |
| Lint | `npm run lint` | ESLint via `eslint-config-next` |
| Typecheck | `npm run typecheck` (`tsc --noEmit`) | Strict TS verification |
| Build | `npm run build` | Production build (Turbopack) |

Triggers:

- `push` to `main`
- `pull_request` to `main`

`concurrency: cancel-in-progress` cancels superseded runs on the same branch / PR.

## Rules and invariants

- **Node version is pinned** to 20.x in the workflow. If you upgrade, also bump the local `engines` field if/when added.
- **`npm ci` only** in CI — never `npm install` (it can mutate the lockfile).
- **All three checks must pass** before merge. They take ~30–60 s combined on a small instance.
- **`NEXT_TELEMETRY_DISABLED=1`** is set so CI logs stay clean.

## Common patterns

### Mirroring CI locally

```bash
npm ci
npm run lint
npm run typecheck
npm run build
```

If any step fails locally, it will fail in CI — fix it before pushing.

### Adding a new check

1. Add the npm script to [package.json](../../package.json) (e.g. `"test": "vitest run"`).
2. Add a step to [.github/workflows/ci.yml](../../.github/workflows/ci.yml) after the existing checks.
3. Verify the matrix locally with `act` or a draft PR.

## Gotchas

- **Stale `.next` between local runs after route restructures** can mask CI failures (TS will pass locally because the validator was generated for old routes). CI does a clean `npm ci` + clean build so it catches the regression. Mirror by deleting `.next/` before retrying locally.
- **Lockfile drift** — if you add a dependency without updating the lockfile, `npm ci` will fail. Always commit the updated `package-lock.json`.
- **Workflow concurrency cancels in-flight runs.** If you see "Canceled" on an older PR commit, that's expected — the latest commit started a new run.
- **No deploy step yet.** The hosting decision is tracked in [3rd-party/hosting.md](../3rd-party/hosting.md). Until then, builds are validation-only.
