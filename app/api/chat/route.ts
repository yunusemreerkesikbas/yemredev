import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { isAppLocale, type AppLocale } from "@/i18n/routing";
import { getProfile, getProjects } from "@/lib/data";
import { buildSystemPrompt } from "@/lib/ai/system-prompt";
import { getChatModel, getModelName } from "@/lib/ai/openai";
import { mapError } from "@/lib/ai/errors";
import { chatRatelimit, getClientIp } from "@/lib/ratelimit";

export const maxDuration = 30;

const ALLOWED_ORIGINS = [
  "https://yemredev.com",
  ...(process.env.NODE_ENV === "development" ? ["http://localhost:3000"] : []),
];

const MAX_MESSAGES = 20;
const MAX_CONTENT_LENGTH = 4000;

type ChatRequestBody = {
  messages?: UIMessage[];
  locale?: string;
};

export async function OPTIONS(request: Request) {
  const origin = request.headers.get("origin") ?? "";
  const allowed = ALLOWED_ORIGINS.includes(origin);
  return new Response(null, {
    status: allowed ? 204 : 403,
    headers: allowed
      ? {
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        }
      : {},
  });
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return new Response("Forbidden", { status: 403 });
  }

  if (!chatRatelimit && process.env.NODE_ENV === "production") {
    return Response.json({ error: "service_unavailable" }, { status: 503 });
  }

  if (chatRatelimit) {
    try {
      const ip = getClientIp(request);
      const { success, reset } = await chatRatelimit.limit(ip);
      if (!success) {
        const retryAfterSeconds = Math.max(
          1,
          Math.ceil((reset - Date.now()) / 1000),
        );
        return Response.json(
          { error: "rate_limited", retryAfter: reset },
          {
            status: 429,
            headers: { "Retry-After": String(retryAfterSeconds) },
          },
        );
      }
    } catch {
      console.warn("[ratelimit] Upstash unreachable — skipping rate limit check");
    }
  }

  let body: ChatRequestBody;
  try {
    body = (await request.json()) as ChatRequestBody;
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }

  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }

  if (body.messages.length > MAX_MESSAGES) {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }

  const oversized = body.messages.some((msg) => {
    const parts = (msg as { parts?: unknown[] }).parts ?? [];
    const text = parts
      .filter(
        (p): p is { type: "text"; text: string } =>
          typeof p === "object" &&
          p !== null &&
          (p as { type: string }).type === "text",
      )
      .map((p) => p.text)
      .join("");
    return text.length > MAX_CONTENT_LENGTH;
  });
  if (oversized) {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }

  const locale: AppLocale =
    body.locale && isAppLocale(body.locale) ? body.locale : "en";

  const profile = getProfile(locale);
  const projects = getProjects(locale);
  const system = buildSystemPrompt(profile, locale, projects);

  try {
    const result = streamText({
      model: getChatModel(),
      system,
      messages: await convertToModelMessages(body.messages),
      maxOutputTokens: 500,
      temperature: 0.6,
      maxRetries: 1,
    });
    return result.toUIMessageStreamResponse();
  } catch (e) {
    const { status, code } = mapError(e);
    console.error("[chat] provider error", { status, code });
    return Response.json({ error: code }, { status });
  }
}

export async function GET() {
  return Response.json(
    {
      status: "active",
      phase: 6,
      ready: true,
      model: getModelName(),
    },
    { status: 200 },
  );
}
