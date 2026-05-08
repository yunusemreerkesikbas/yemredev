# Hosting

## Purpose

`yemredev.com` is a static-first Next.js app with two API routes (one Edge, one Node). The hosting target is **not yet selected** — this page tracks the candidates and the constraints the choice must satisfy.

CI is provider-agnostic today; a `deploy` job will be appended to [.github/workflows/ci.yml](../../.github/workflows/ci.yml) once the host is chosen.

## Status

| | |
| --- | --- |
| Selected host | _none_ |
| Domain | `yemredev.com` |
| CI | [.github/workflows/ci.yml](../../.github/workflows/ci.yml) (lint / typecheck / build only) |
| Deploy step | not yet wired |

## Candidates

| Host | Strengths | Weaknesses |
| --- | --- | --- |
| **Vercel** | Native Next.js DX, Edge runtime, `x-vercel-ip-country` header out of the box, ISR, generous hobby tier, instant previews on PRs | Vendor lock-in for some Next.js features (ISR, Edge config) |
| **Cloudflare Pages / Workers** | Cheapest at scale, fast Edge, `cf-ipcountry` header, free SSL | Some Next.js features need adapters or are unsupported (full ISR, image optimization) |
| **DigitalOcean App Platform** | Predictable pricing, MCP integration already configured locally, no vendor surprises | Cold starts, no built-in geolocation header (would need an IP service), Turbopack support is community-tested |
| **Self-host (Docker + VPS)** | Full control, lowest theoretical cost | All operational work (TLS, scaling, monitoring) is on us, no built-in geolocation, slow iteration |

## Decision criteria

In rough order of weight:

1. **Native support for Next.js 16 + Turbopack production builds.**
2. **Geolocation header** — [proxy.ts](../../proxy.ts) currently checks `x-vercel-ip-country` and `cf-ipcountry`. Picking a host without one means adding an IP-to-country service (paid) or losing automatic Turkish locale routing.
3. **Edge runtime support** — `/api/chat` is on Edge (Phase 6).
4. **Custom domain + automatic TLS.**
5. **Preview deploys on PRs** — speeds up reviews.
6. **Cost** at portfolio-volume traffic should be free or near-free.

## Integration plan (per host)

### Vercel

1. Connect the GitHub repo via the Vercel dashboard.
2. Add env vars (eventually `OPENAI_API_KEY` etc.) in the Vercel project settings.
3. Vercel deploys on every push to `main`; PRs get auto-previews — no GitHub Actions deploy step required.
4. Point `yemredev.com` DNS to Vercel.
5. Verify `proxy.ts` reads `x-vercel-ip-country` correctly with a TR-located test.

### Cloudflare Pages

1. Install the `@cloudflare/next-on-pages` adapter and update `package.json` build script.
2. Connect the GitHub repo via Cloudflare Pages dashboard.
3. Add env vars in Cloudflare dashboard.
4. Verify `proxy.ts` reads `cf-ipcountry` correctly (already supported in [proxy.ts](../../proxy.ts)).

### DigitalOcean App Platform

1. Create an App pointing at the GitHub repo.
2. Add a deploy step to [.github/workflows/ci.yml](../../.github/workflows/ci.yml) using `digitalocean/app_action`.
3. Add an IP-geolocation lookup (e.g. Cloudflare's free GeoIP via a fetch in `proxy.ts`) since the platform doesn't inject a country header.
4. Add env vars via DO App Platform UI.

### Self-host

1. Add a multi-stage `Dockerfile` (`node:20-alpine` build + `node:20-alpine` runtime).
2. Add a `docker-compose.yml` with a reverse proxy (Caddy / Nginx).
3. Wire LetsEncrypt for TLS.
4. Add a deploy step to CI that pushes the image to a registry and SSHes to the VPS to pull.
5. Inject country via an IP service (no header from the OS).

## Operational concerns

- **Secrets**: never in source. Each host has a secrets store; pick one and use it.
- **Logs**: keep request logs to investigate locale-detection bugs; never log message bodies from `/api/contact`.
- **Uptime**: free tier hosts can cold-start. The landing should remain interactive even before `/api/chat` warms up.
- **Region**: deploy to a Europe edge first since the primary visitor base is TR; the AI provider's region should match where possible.

## Gotchas

- **Geolocation header lock-in.** [proxy.ts](../../proxy.ts) currently reads two header names. If the chosen host emits a third (or none), it must be added — silently falling back to `Accept-Language` is acceptable but reduces accuracy.
- **Edge-runtime compatibility differs by host.** `/api/chat` will need a smoke test on the chosen host before Phase 6.
- **Image optimization** is a paid feature on Vercel beyond hobby; not used today, but Phase 4 will load project covers — pick the host knowing this.
- **DNS propagation** can take hours; book the domain switch at least a day before any milestone.
