# API Placeholders

## Purpose

Two route handlers were scaffolded so future phases could ship UI against a stable URL. As of Phase 6, **`/api/chat` is fully active** and streams responses via the Vercel AI SDK; **`/api/contact` is still a 501 stub** awaiting Phase 5.

## Source of truth

- AI streaming endpoint: [app/api/chat/route.ts](../../app/api/chat/route.ts) — **active**
- Contact submission endpoint: [app/api/contact/route.ts](../../app/api/contact/route.ts) — scaffold
- Provider candidates: [3rd-party/ai-providers.md](../3rd-party/ai-providers.md), [3rd-party/contact-providers.md](../3rd-party/contact-providers.md)

## `/api/chat` (active)

| Aspect | Value |
| --- | --- |
| Methods | `POST` (streaming), `GET` (status probe) |
| Runtime | `edge` |
| Phase | 6 |
| Current behavior | `POST` → streams an AI message via `toUIMessageStreamResponse()`; `GET` → `200 { status: "active", phase: 6, ready: true, model }` |
| Cost guard | `maxOutputTokens: 500` |
| Rate limit | Upstash sliding window, 10 req / 60s per client IP |

### Request shape (`POST`)

```json
{
  "messages": [{ "role": "user", "id": "...", "parts": [{ "type": "text", "text": "Hi" }] }],
  "locale": "en"
}
```

`messages` is the `UIMessage[]` array sent by `useChat` from `@ai-sdk/react`. `locale` is optional (defaults to `"en"`); it must be one of the app locales (`en` / `tr`) and is used to pin the system prompt language.

### Error responses

All non-streaming errors return JSON with one of these `error` codes — the client maps each to a localized `chat.errors.<code>` string:

| HTTP | `error` code | Cause |
| --- | --- | --- |
| 400 | `bad_request` | Invalid JSON body or empty `messages` array |
| 429 | `rate_limited` | Upstash limit exceeded; includes `Retry-After` header |
| 502 | `provider_unavailable` | OpenAI returned 5xx / 401 / 403 |
| 500 | `server_error` | Unexpected exception |

## `/api/contact` (scaffold — Phase 5)

| Aspect | Value |
| --- | --- |
| Methods | `POST` |
| Runtime | `nodejs` (Node default — provider may need Node-only SDKs) |
| Phase | 5 |
| Current behavior | `POST` → `501 { error: "not_implemented", message }` |

## Rules and invariants

- **`/api/*` is excluded from the proxy matcher** in [proxy.ts](../../proxy.ts). Don't add any locale logic to API routes — the client sends `locale` in the body.
- **Response shape always JSON.** Even error responses return JSON so the client can parse uniformly.
- **Edge runtime for `/api/chat`** is fixed because it streams. Don't switch to Node without revisiting the streaming pattern.
- **`runtime` is per-route**, not per-method. Splitting GET to Node and POST to Edge in the same file is not supported — pick one.

## Implementation guide

### Activating `/api/contact` (Phase 5)

1. Pick a provider from [3rd-party/contact-providers.md](../3rd-party/contact-providers.md) and uncomment the matching block in [.env.example](../../.env.example).
2. Replace the body of [app/api/contact/route.ts](../../app/api/contact/route.ts) with:
   - Body parsing (validate `name`, `email`, `message`)
   - Provider call
   - Returning `200 { ok: true }` on success, `400` on validation error, `502` on provider failure
3. Wire the form in [app/[locale]/contact/page.tsx](../../app/[locale]/contact/page.tsx) to `POST` here.
4. Document the provider in [3rd-party/contact-providers.md](../3rd-party/contact-providers.md) (move it from "Candidate" to "Selected").

### `/api/chat` activation (Phase 6 — done)

Done as of 2026-05-10. See [3rd-party/ai-providers.md](../3rd-party/ai-providers.md) "Live integration shape" for the file map. To swap provider later, change [lib/ai/openai.ts](../../lib/ai/openai.ts).

## Security

There are no tenants. Treat both endpoints as public:

- **Rate-limit** `/api/chat` via Upstash; `/api/contact` should add the same when activated.
- **Validate input** — both routes must reject empty / oversized payloads.
- **Secrets in env only.** Never inline an API key.
- **Origin check** for `/api/contact` if abuse is observed; not required for `/api/chat` because the rate limit + cost guard already cover it.
- **Never log message content** in `/api/chat` — only `{ status, code, model }` on errors.

## Gotchas

- **AI SDK v6 message shape** — `messages` arrives as `UIMessage[]` (with `parts`), must be awaited through `convertToModelMessages()` before the model call. The route currently does this; copy-paste from older AI SDK docs at your peril.
- **Edge runtime imports differ from Node** — Node-only SDKs (e.g. `nodemailer`) won't work on `/api/chat`. Stick to fetch-based or Edge-compatible SDKs there. `@upstash/redis` is fetch-based and verified.
- **Upstash env unset** — `lib/ratelimit.ts` falls back to `null` and logs a one-time warn on prod build. Acceptable for local dev only; missing in production = unrated endpoint.
