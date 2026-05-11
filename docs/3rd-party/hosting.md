# Hosting

## Purpose

`yemredev.com` is a static-first Next.js app with two API routes (both Node.js runtime). Hosted on **Cloudflare Workers** via the `@opennextjs/cloudflare` adapter. Deployed manually via GitHub Actions `workflow_dispatch`.

## Status

| | |
| --- | --- |
| Selected host | **Cloudflare Workers** |
| Adapter | `@opennextjs/cloudflare` ^1.19.8 |
| Worker name | `yemredev` |
| Domain | `yemredev.com`, `www.yemredev.com` (custom domain on Worker) |
| DNS | Cloudflare (brian.ns / serena.ns) |
| CI | [.github/workflows/ci.yml](../../.github/workflows/ci.yml) (lint / typecheck / build) |
| Deploy | [.github/workflows/deploy.yml](../../.github/workflows/deploy.yml) (`workflow_dispatch`) |
| Secrets | `wrangler secret put` — `OPENAI_API_KEY`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` |

## Deployment setup

### Key files

| File | Purpose |
| --- | --- |
| [open-next.config.ts](../../open-next.config.ts) | Adapter config: `cloudflare-node` wrapper, `dummy` cache/queue for Workers |
| [wrangler.jsonc](../../wrangler.jsonc) | Worker name, entry point (`.open-next/worker.js`), assets binding, `nodejs_compat` flag |
| [.github/workflows/deploy.yml](../../.github/workflows/deploy.yml) | Build → Deploy Worker → Sync secrets (manual trigger) |

### Build & deploy commands

```bash
npm run cf:build    # opennextjs-cloudflare build
npm run cf:preview  # wrangler dev (local preview)
npm run cf:deploy   # wrangler deploy --config wrangler.jsonc
```

### Deploy workflow steps

1. `npm ci` — clean install with Node 22
2. `npm run cf:build` — builds Next.js output into `.open-next/`
3. `npx wrangler deploy --config wrangler.jsonc` — uploads Worker
4. `echo "$SECRET" | npx wrangler secret put SECRET_NAME --name yemredev` — syncs each secret

### Triggering a deploy

GitHub → Actions → **Deploy** → **Run workflow** → `master`.

### Adding / rotating a secret

```bash
echo "new-value" | npx wrangler secret put SECRET_NAME --name yemredev
```

Or update the GitHub Actions secret and re-run the Deploy workflow (the "Sync secrets" step runs on every deploy).

## Geolocation

`middleware.ts` reads `cf-ipcountry` for automatic Turkish locale routing — this header is injected by Cloudflare on every request at no extra cost.

## Operational concerns

- **Secrets**: never in source. Managed via `wrangler secret put`; mirrored as GitHub Actions secrets for the deploy workflow.
- **Logs**: available in Cloudflare Dashboard → Workers → `yemredev` → Logs. Never log message bodies from `/api/chat` or `/api/contact`.
- **Cold starts**: Workers have near-zero cold start time — no warm-up needed.
- **Region**: Cloudflare routes to the nearest edge PoP automatically; primary TR traffic hits Istanbul or Frankfurt.

## Gotchas

- **`nodejs_compat` flag is required** in `wrangler.jsonc`. Without it, Node built-ins (crypto, buffer) used by the adapter are unavailable.
- **`edge` runtime exports break the adapter.** All route handlers must use default (Node.js) runtime. Do not add `export const runtime = "edge"` to any route.
- **`wrangler secret bulk` hangs** if piped no input. Use `echo "$VAR" | wrangler secret put VAR_NAME` per secret instead.
- **Custom domain DNS records** must be deleted before adding a domain as a Worker custom domain — Cloudflare rejects the addition if a conflicting A/AAAA/CNAME exists.
- **Image optimization** via `next/image` works on Workers with the `nodejs_compat` flag; no additional config required for the current `qualities: [75, 100]` setup.
