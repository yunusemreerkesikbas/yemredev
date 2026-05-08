import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { isAppLocale, routing } from "./i18n/routing";

const LOCALE_COOKIE = "NEXT_LOCALE";
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

const intlMiddleware = createMiddleware(routing);

function detectLocale(request: NextRequest): "tr" | "en" {
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  if (cookie && isAppLocale(cookie)) {
    return cookie;
  }

  const country =
    request.headers.get("x-vercel-ip-country") ??
    request.headers.get("cf-ipcountry") ??
    "";
  if (country.toUpperCase() === "TR") {
    return "tr";
  }

  const acceptLanguage = request.headers.get("accept-language") ?? "";
  if (/\btr(-tr)?\b/i.test(acceptLanguage)) {
    return "tr";
  }

  return "en";
}

function pathHasLocale(pathname: string): boolean {
  return routing.locales.some(
    (locale) =>
      pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
}

export default function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (!pathHasLocale(pathname)) {
    const locale = detectLocale(request);
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
    url.search = search;

    const response = NextResponse.redirect(url);
    response.cookies.set(LOCALE_COOKIE, locale, {
      path: "/",
      sameSite: "lax",
      maxAge: ONE_YEAR_SECONDS,
    });
    return response;
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
