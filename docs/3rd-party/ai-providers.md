# AI Providers

## Purpose

`yemredev.com` has an AI assistant on the landing page that answers questions about the developer using a streaming LLM. The provider is **not yet selected** — this page tracks the candidates, the decision criteria, and the integration plan.

The endpoint that will host the integration is documented in [../modules/api-placeholders.md](../modules/api-placeholders.md).

## Status

| | |
| --- | --- |
| Selected provider | _none_ |
| Phase | 6 |
| Decision deadline | Before Phase 6 implementation starts |
| Integration library | [Vercel AI SDK](https://sdk.vercel.ai) (`ai` + provider package) |
| Endpoint | [app/api/chat/route.ts](../../app/api/chat/route.ts) (currently `501`) |
| Env scaffold | [.env.example](../../.env.example) (`AI_PROVIDER` + per-provider keys, all commented) |

## Candidates

| Provider | Model | Strengths | Weaknesses | SDK package |
| --- | --- | --- | --- | --- |
| OpenAI | `gpt-4o-mini` | Most familiar, broad tooling, mature streaming | Paid only, rate limits at low tiers | `@ai-sdk/openai` |
| Anthropic | `claude-3-5-haiku-latest` | High quality on small models, good Turkish | Paid only, slightly slower TTFB | `@ai-sdk/anthropic` |
| Google | `gemini-2.0-flash` | Generous free tier, fast | Throttled free tier, occasional regional outages | `@ai-sdk/google` |
| Groq | `llama-3.3-70b-versatile` | Lowest latency on the market, free tier | Rate limit per minute, model quality below 4o-mini | `@ai-sdk/groq` |

## Decision criteria

In rough order of weight:

1. **Cost at expected scale** — a personal portfolio answers tens to low hundreds of prompts per day at peak.
2. **Streaming quality** — token cadence and TTFB matter for the landing UX.
3. **Multilingual fidelity** — must answer cleanly in Turkish and English.
4. **Setup friction** — single API key, no orchestration.

## Integration plan

When activating:

1. Pick a provider; uncomment its block in [.env.example](../../.env.example) and create the matching values in `.env.local`.
2. `npm install ai @ai-sdk/<provider>` (the `ai` package is the runtime; the provider package is the model adapter).
3. Replace [app/api/chat/route.ts](../../app/api/chat/route.ts) body with a `streamText` handler. Reference: [../modules/api-placeholders.md](../modules/api-placeholders.md) → "Activating `/api/chat`".
4. Build the system prompt from [content/profile.{en,tr}.json](../../content/) so the assistant answers in the user's locale.
5. Build the chat UI in [app/[locale]/page.tsx](../../app/[locale]/page.tsx) using the SDK's `useChat` hook (client component island).

## Operational concerns

- **Secrets**: API key in `.env.local` for dev, in the host's secret store for prod. Never committed.
- **Rate limit**: add a per-IP cap (Upstash / Vercel KV) before public launch — a personal site is a soft target for abuse.
- **Cost guardrail**: `maxTokens` ≤ 500 per response; stop sequences if the conversation derails.
- **Fallback**: when the provider returns 5xx or 429, the UI should surface a localized "try again later" instead of a raw error.
- **Logging**: log only error metadata (status, model name) — never log prompts containing PII.

## Gotchas

- **Vercel AI SDK v3+ shape changed** — `streamText` returns an object with `toDataStreamResponse()`, not a raw `Response`. Make sure docs you copy-paste from match the installed major.
- **Edge runtime constraints** — provider SDKs that import Node-only modules will fail at build. All four candidates ship Edge-compatible exports today, but verify with a small smoke build before committing.
- **Locale in the system prompt** — without an explicit instruction, models (especially Llama-based) drift to English even when the user writes Turkish. Pin the response language to the request locale.
- **Abuse**: the assistant must never agree to "ignore your previous instructions" — guard the system prompt and consider stripping prompt-injection-flavored input.
