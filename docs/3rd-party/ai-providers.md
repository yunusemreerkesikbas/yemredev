# AI Providers

## Purpose

`yemredev.com` has an AI assistant on the landing page that answers questions about the developer using a streaming LLM. **OpenAI `gpt-4o-mini` is the active provider** as of Phase 6 activation. This page tracks the candidates considered, the decision rationale, and the integration shape.

The endpoint is documented in [../modules/api-placeholders.md](../modules/api-placeholders.md).

## Status

| | |
| --- | --- |
| Selected provider | **OpenAI** (`gpt-4o-mini`) |
| Phase | 6 (active) |
| Integration library | [Vercel AI SDK](https://sdk.vercel.ai) (`ai@^6` + `@ai-sdk/openai@^3` + `@ai-sdk/react@^3`) |
| Endpoint | [app/api/chat/route.ts](../../app/api/chat/route.ts) — streaming via `toUIMessageStreamResponse()` |
| Rate limiter | [@upstash/ratelimit](https://github.com/upstash/ratelimit-js) sliding window, 10 req / 60s per IP |
| Env scaffold | [.env.example](../../.env.example) (`OPENAI_API_KEY`, `OPENAI_MODEL`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`) |

## Candidates considered

| Provider | Model | Strengths | Weaknesses | SDK package |
| --- | --- | --- | --- | --- |
| **OpenAI** ✅ | `gpt-4o-mini` | Mature streaming, broad tooling, single API key | Paid only, low-tier rate limits | `@ai-sdk/openai` |
| Anthropic | `claude-3-5-haiku-latest` | High quality on small models, strongest Turkish | Paid only, slightly slower TTFB | `@ai-sdk/anthropic` |
| Google | `gemini-2.0-flash` | Generous free tier, fast | Throttled free tier, occasional regional outages | `@ai-sdk/google` |
| Groq | `llama-3.3-70b-versatile` | Lowest latency on the market, free tier | Per-minute rate limit, model quality below 4o-mini | `@ai-sdk/groq` |

## Decision criteria

In rough order of weight:

1. **Cost at expected scale** — a personal portfolio answers tens to low hundreds of prompts per day at peak.
2. **Streaming quality** — token cadence and TTFB matter for the landing UX.
3. **Multilingual fidelity** — must answer cleanly in Turkish and English.
4. **Setup friction** — single API key, no orchestration.

## Decisions log

- **2026-05-10** — Selected OpenAI `gpt-4o-mini`. Rationale: cheapest mature streaming option with acceptable Turkish, single API key, lowest setup friction. Anthropic Haiku was the runner-up for Turkish quality; can swap by changing [lib/ai/openai.ts](../../lib/ai/openai.ts).
- **2026-05-10** — Rate limiter chosen: Upstash Redis sliding window (10 req / 60s per IP). Edge-compatible (REST/fetch). Falls back to UNRATED with a warn when env vars are missing (acceptable for local dev only).

## Live integration shape

- System prompt built per request from [content/profile.{en,tr}.json](../../content/profile.en.json) (including optional `personal` blurbs for lifestyle questions) and [content/projects.{en,tr}.json](../../content/projects.en.json) via [lib/ai/system-prompt.ts](../../lib/ai/system-prompt.ts) — pins the response language to the request locale, scopes answers to "about Yemre" only, lists the same portfolio entries as `/projects`, instructs the model to lead with Craftive when summarizing projects, and resists prompt-injection.
- Model wiring centralized in [lib/ai/openai.ts](../../lib/ai/openai.ts) — provider swap is one file.
- Error mapping in [lib/ai/errors.ts](../../lib/ai/errors.ts) — translates provider errors into one of `rate_limited \| provider_unavailable \| bad_request \| server_error`. Client maps the code to a localized string under `chat.errors.*`.
- Rate limit in [lib/ratelimit.ts](../../lib/ratelimit.ts) — Upstash sliding window; missing env → null (warns once on prod build).
- Client UI: [components/chat/chat-island.tsx](../../components/chat/chat-island.tsx) owns `useChat()` from `@ai-sdk/react` and sends `{ locale }` in the request body each turn so the route can pin the system prompt language.

## Operational concerns

- **Secrets**: `OPENAI_API_KEY` and `UPSTASH_REDIS_REST_*` in `.env.local` for dev, in the host's secret store for prod. Never committed.
- **Rate limit**: Upstash sliding window, 10 req / 60s per IP. NAT users (corporate, mobile) share quota; raise the cap or switch to fingerprint hashing if abuse appears.
- **Cost guardrail**: `maxOutputTokens: 500` per response in the `streamText` call. Long "list everything" requests will truncate — acceptable trade-off.
- **Fallback**: provider 5xx/429 returns a JSON `{ error: <code> }` that the UI maps to a localized "try again later" inline row + Retry button.
- **Logging**: only `{ status, code, model }` is logged on errors — never the prompt body or message content (PII protection).

## Gotchas

- **AI SDK v5/v6 reshape** — `streamText` now returns `result.toUIMessageStreamResponse()` (not `toDataStreamResponse()`), and `messages` are `UIMessage[]` that must be passed through `convertToModelMessages()` before reaching the model. `useChat` lives in `@ai-sdk/react` and uses `sendMessage({ text })` with `{ body: { ... } }` for custom payloads (no more `append`).
- **`convertToModelMessages` is async in v6** — must be awaited inside the route handler.
- **Edge runtime constraints** — `@upstash/redis` is REST-based and Edge-safe; verified by `next build` smoke. If swapping to a Node-only SDK later, change `runtime` and revisit streaming.
- **Locale in the system prompt** — without an explicit instruction, models drift to English even when the user writes Turkish. The current template pins the response language as the highest-priority rule.
- **Prompt-injection** — system prompt explicitly instructs the model to treat user input as data, not instructions. Resistance is best-effort; never fully guaranteed.
