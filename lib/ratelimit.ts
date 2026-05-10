import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

export const chatRatelimit =
  url && token
    ? new Ratelimit({
        redis: new Redis({ url, token }),
        limiter: Ratelimit.slidingWindow(10, "60 s"),
        analytics: false,
        prefix: "yemredev:chat",
      })
    : null;

if (!chatRatelimit && process.env.NODE_ENV === "production") {
  console.error(
    "[ratelimit] Upstash env not set — /api/chat is running UNRATED in production",
  );
}

export function getClientIp(request: Request): string {
  // Vercel platform — injected by edge network, not user-controlled
  const vercelIp = request.headers.get("x-vercel-forwarded-for");
  if (vercelIp) return vercelIp.split(",")[0].trim();
  // Cloudflare — injected by edge, not user-controlled
  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim();
  // Fallback: trust only the first hop (may be spoofable without a trusted proxy)
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const xri = request.headers.get("x-real-ip");
  if (xri) return xri.trim();
  return "unknown";
}
