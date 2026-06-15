import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const AUTH_PAGES = ["/auth/login", "/auth/register", "/auth/forgot-password"];

function getLocale(pathname: string): string {
  const segment = pathname.split("/")[1];
  return routing.locales.includes(segment as "en" | "th")
    ? segment
    : routing.defaultLocale;
}

function stripLocale(pathname: string): string {
  const locale = getLocale(pathname);
  return pathname.replace(new RegExp(`^/${locale}`), "") || "/";
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathWithoutLocale = stripLocale(pathname);
  const isAuthPage = AUTH_PAGES.some((p) => pathWithoutLocale.startsWith(p));
  const isAuthenticated = request.cookies.has("fb-auth");

  if (!isAuthenticated && !isAuthPage) {
    const locale = getLocale(pathname);
    return NextResponse.redirect(
      new URL(`/${locale}/auth/login`, request.url)
    );
  }

  if (isAuthenticated && isAuthPage) {
    const locale = getLocale(pathname);
    return NextResponse.redirect(new URL(`/${locale}/units`, request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
