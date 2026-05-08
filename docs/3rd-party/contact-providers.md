# Contact Providers

## Purpose

The contact form on `/{locale}/contact` (Phase 5) needs to deliver messages to the developer. The provider is **not yet selected** — this page tracks the candidates and the integration plan.

The endpoint that will host the integration is documented in [../modules/api-placeholders.md](../modules/api-placeholders.md).

## Status

| | |
| --- | --- |
| Selected provider | _none_ |
| Phase | 5 |
| Decision deadline | Before Phase 5 implementation starts |
| Endpoint | [app/api/contact/route.ts](../../app/api/contact/route.ts) (currently `501`) |
| Env scaffold | [.env.example](../../.env.example) (`CONTACT_PROVIDER`, `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, …) |

## Candidates

| Provider | Pattern | Strengths | Weaknesses |
| --- | --- | --- | --- |
| **Resend** | API route → Resend SDK → email | Native Next.js DX, generous free tier (3000/month), nice DX, works with custom domain | Requires DNS setup for custom-domain "from" address |
| **Formspree** | HTML form `action="..."` directly to Formspree | Zero backend, fast to ship | Captcha / spam tier behind paywall, branding on free tier |
| **Web3Forms** | Same shape as Formspree | Free with no signup, no monthly cap on hobby use | Less mature, smaller user base |
| **EmailJS** | Client-side SDK posting from the browser | No API route required | Public API key in client bundle, weaker abuse posture |
| **`mailto:`** | Anchor that opens the user's email client | Zero infra | Not really a form, fails on devices without a default mail client |

## Decision criteria

In rough order of weight:

1. **Deliverability** — landing in the inbox is non-negotiable. SPF / DKIM / DMARC need to be straightforward.
2. **Spam posture** — must support either captcha or honeypot, ideally both.
3. **Sender domain** — should be able to send from `contact@yemredev.com` once DNS is configured.
4. **Cost** — free tier should cover personal-portfolio volume.
5. **Integration friction** — fewer moving parts wins.

## Integration plan (any provider)

1. Pick a provider; uncomment its block in [.env.example](../../.env.example).
2. (If API-route based) `npm install <sdk>`; replace [app/api/contact/route.ts](../../app/api/contact/route.ts) body with the provider call.
3. Build the form in [app/[locale]/contact/page.tsx](../../app/[locale]/contact/page.tsx). Required fields: name, email, message.
4. Add inline validation (`type="email"`, `required`, `maxLength`).
5. Add a honeypot field (hidden visually, expected to be empty when humans submit) and reject any submission that fills it in.
6. On success show a localized confirmation message; on failure show a localized retry message.
7. Document the choice in this file (move it from "Candidate" to "Selected").

## Operational concerns

- **Secrets**: API keys in `.env.local` for dev, in host secrets for prod. `CONTACT_TO_EMAIL` is **not** secret but is kept in env so we can rotate without redeploying source.
- **Rate limit**: cap one submission per IP per minute. Without a backend store this can use an in-memory `Map` keyed by IP — acceptable for a single-instance deploy, replace with KV for multi-instance.
- **Validation**: server-side validation is mandatory even with client-side `required` attributes.
- **Audit**: log only `{ ts, ip, ok, providerStatus }` — never the message body.
- **Privacy**: form must include a clear note about what is collected (name + email + message) and where it is sent.

## Gotchas

- **Resend custom domain** requires DNS records (`MX`, `TXT` for SPF/DKIM/DMARC) on `yemredev.com`. Without them you can only send from `onboarding@resend.dev`, which looks unprofessional.
- **EmailJS exposes the API key** to the browser. Treat it as compromised by design and rely on EmailJS's own quotas / origin allowlist.
- **`mailto:` is not a real fallback** for users on a desktop browser without a default mail client (e.g. Chromebooks). If chosen, also surface a copyable email address.
- **Spam wave** — the moment the form is live, expect bots within hours. Honeypot + simple keyword filter (e.g. "SEO services", "https://" in name field) blocks 90 % of garbage.
- **Edge runtime** — Resend's official SDK is Node-only at the time of writing. Keep [app/api/contact/route.ts](../../app/api/contact/route.ts) on `runtime = "nodejs"`.
