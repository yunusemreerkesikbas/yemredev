# yemredev.com — source repository

This repo contains the Next.js application for **Yunus Emre Erkesikbaş**’s personal site ([yemredev.com](https://yemredev.com)). The goal is a clear **what exists / what does not** for anyone cloning or reviewing the code — not product marketing copy.

---

## What is actually in this repo?

| Route (locale prefix `/tr` or `/en`) | What it does |
| --- | --- |
| `/{locale}` | Landing: chat UI, quick-prompt chips, **Skip intro** navigation to `/home`. |
| `/{locale}/home` | Overview “dashboard” page (profile data from `content/` + components). |
| `/{locale}/projects` | Project slides and horizontal carousel. |
| `/{locale}/contact` | Email (`mailto` / link from profile), location text, social links. **No form POST to the server.** |

- **i18n:** `next-intl`, locale in the URL; redirects via `proxy.ts` + cookie / country headers / `Accept-Language` (see `i18n/`).
- **Theming:** `next-themes`, dark by default.
- **Content:** `content/*.json` (profile, projects) + `messages/*.json` (UI strings).

---

## AI chat (`/api/chat`)

- **Requires environment variables** to work — at minimum `OPENAI_API_KEY` (and related AI fields in `.env.example`). Without keys the route returns an error; do not assume a “magic working demo”.
- The server builds a system message from **profile and project JSON** under `content/` (`lib/ai/system-prompt.ts`). That is context for the model; the model can still be wrong or hallucinate — this repo does not guarantee factual answers.
- **Rate limiting:** Upstash (`UPSTASH_REDIS_*`) is intended for production; per `.env.example`, if unset locally, requests may be unrated.

---

## Not implemented / stubs

- **`POST /api/contact`:** returns `501` / `not_implemented`; the contact page does not call this endpoint.
- **Email provider integration** (Resend, etc.): only commented placeholders in `.env.example`; there is no completed “submit form → send mail” flow in code.

---

## Tech stack (summary)

Next.js 16 (App Router), React 19, TypeScript (strict), Tailwind CSS v4, next-intl, next-themes, Vercel AI SDK + OpenAI, Motion, `@upstash/ratelimit` / Redis (for chat).

---

## Run locally

```bash
npm install
cp .env.example .env.local   # Fill at least OPENAI_API_KEY for chat
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — requests to `/` are redirected to a locale.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm run start` | Production build and run |
| `npm run lint` / `npm run typecheck` | ESLint and `tsc --noEmit` |
| `npm run cf:*` | Cloudflare (OpenNext) — see `package.json` |

CI (`.github/workflows/ci.yml`): `lint` → `typecheck` → `build` on pushes and PRs to `master`.

---

## More documentation

- [AGENTS.md](AGENTS.md) — developer rules and conventions  
- [DESIGN.md](DESIGN.md) — UI / typography  
- [docs/README.md](docs/README.md) — module index  

---

## License

Private repository. All rights reserved.
