# API Placeholders

## Purpose

Two route handlers are scaffolded so future phases can ship UI against a stable URL. Both currently return `501 Not Implemented` with a JSON body explaining which phase will activate them. The contract (URL, method, response shape on success) will be designed when the corresponding provider decision is made.

## Source of truth

- AI streaming endpoint: [app/api/chat/route.ts](../../app/api/chat/route.ts)
- Contact submission endpoint: [app/api/contact/route.ts](../../app/api/contact/route.ts)
- Provider candidates: [3rd-party/ai-providers.md](../3rd-party/ai-providers.md), [3rd-party/contact-providers.md](../3rd-party/contact-providers.md)

## `/api/chat`

| Aspect | Value |
| --- | --- |
| Methods | `POST` (eventually streaming), `GET` (status probe) |
| Runtime | `edge` |
| Phase | 6 |
| Current behavior | `POST` → `501 { error: "not_implemented", message }`; `GET` → `200 { status: "scaffold", phase: 6, ready: false }` |

The `GET` is intentional — it gives uptime / smoke checks something to assert before the streaming endpoint is live.

## `/api/contact`

| Aspect | Value |
| --- | --- |
| Methods | `POST` |
| Runtime | `nodejs` (Node default — provider may need Node-only SDKs) |
| Phase | 5 |
| Current behavior | `POST` → `501 { error: "not_implemented", message }` |

## Rules and invariants

- **`/api/*` is excluded from the proxy matcher** in [proxy.ts](../../proxy.ts). Don't add any locale logic to API routes.
- **No business logic yet.** These files exist solely to reserve the URL and runtime choice. When activating, replace the body — don't fork into a `/api/v1/*` namespace.
- **Response shape always JSON.** Even error responses return JSON so the client can parse uniformly.
- **Edge runtime for `/api/chat`** is fixed because Phase 6 will stream. Don't switch to Node without revisiting the streaming pattern.

## Implementation guide

### Activating `/api/contact` (Phase 5)

1. Pick a provider from [3rd-party/contact-providers.md](../3rd-party/contact-providers.md) and uncomment the matching block in [.env.example](../../.env.example).
2. Replace the body of [app/api/contact/route.ts](../../app/api/contact/route.ts) with:
   - Body parsing (validate `name`, `email`, `message`)
   - Provider call
   - Returning `200 { ok: true }` on success, `400` on validation error, `502` on provider failure
3. Wire the form in [app/[locale]/contact/page.tsx](../../app/[locale]/contact/page.tsx) to `POST` here.
4. Document the provider in [3rd-party/contact-providers.md](../3rd-party/contact-providers.md) (move it from "Candidate" to "Selected").

### Activating `/api/chat` (Phase 6)

1. Pick a provider from [3rd-party/ai-providers.md](../3rd-party/ai-providers.md), uncomment the matching block in [.env.example](../../.env.example), `npm install ai @ai-sdk/<provider>`.
2. Replace the body of [app/api/chat/route.ts](../../app/api/chat/route.ts) with a Vercel AI SDK streaming handler:

   ```ts
   import { streamText } from "ai";
   // import the provider per .env.AI_PROVIDER
   const result = streamText({ model, system, messages });
   return result.toDataStreamResponse();
   ```

3. The system prompt should hydrate from [content/profile.{en,tr}.json](../../content/) so the assistant answers in the user's locale.
4. Wire the chat UI in [app/[locale]/page.tsx](../../app/[locale]/page.tsx) to consume the stream.
5. Document the provider in [3rd-party/ai-providers.md](../3rd-party/ai-providers.md).

## Security & tenant isolation

There are no tenants. Treat both endpoints as public:

- **Rate-limit** at the provider level (Resend, OpenAI, etc.) and consider a request-IP throttle in front (Vercel KV, Upstash, etc.) when activating.
- **Validate input** — the contact form must reject empty / oversized payloads to protect the email provider quota.
- **Secrets in env only.** Never inline an API key.
- **Origin check** for `/api/contact` if abuse is observed; not required out of the gate.

## Gotchas

- **501 on POST currently breaks form-style submissions.** Forms in early Phase 2/3 builds must not POST to these endpoints until they are activated, or users will see a JSON error.
- **Edge runtime imports differ from Node** — Node-only SDKs (e.g. `nodemailer`) won't work on `/api/chat`. Stick to fetch-based or Edge-compatible SDKs there.
- **`runtime` is per-route**, not per-method. Splitting GET to Node and POST to Edge in the same file is not supported — pick one.
