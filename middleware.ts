import { NextResponse, type NextRequest } from "next/server";

const locales = ["de", "en", "es", "fr", "id", "it", "nl", "pt", "tr"];
const defaultLocale = "en";
const localeCookie = "techtools-locale";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];

  let locale = defaultLocale;
  let hasLocalePrefix = false;

  if (locales.includes(firstSegment)) {
    hasLocalePrefix = true;
    locale = firstSegment;
    const pathWithoutLocale = "/" + segments.slice(1).join("/");
    request.nextUrl.pathname = pathWithoutLocale || "/";
  }

  // Un-prefixed URLs (/hash-text) duplicate the canonical /en/hash-text.
  // Redirect crawlers and users to the canonical locale URL so Google indexes
  // one address per page instead of two. Crawlers carry no cookie, so they
  // always land on /en/... ; a visitor's saved locale is still honoured.
  // Set NEXT_PUBLIC_CANONICAL_REDIRECT="false" to keep the old behaviour.
  if (!hasLocalePrefix && process.env.NEXT_PUBLIC_CANONICAL_REDIRECT !== "false") {
    const cookieLocale = request.cookies.get(localeCookie)?.value;
    const target = locales.includes(cookieLocale || "") ? (cookieLocale as string) : defaultLocale;
    const redirectUrl = new URL(request.nextUrl);
    redirectUrl.pathname = `/${target}${pathname === "/" ? "/" : pathname}`;
    return NextResponse.redirect(redirectUrl, 308);
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", locale);
  // Exposed so the root layout can build breadcrumb structured data.
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  const response = NextResponse.rewrite(request.nextUrl, { request: { headers: requestHeaders } });
  response.cookies.set(localeCookie, locale, { path: "/", maxAge: 60 * 60 * 24 * 365 });

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|robots.txt|sitemap.xml|llms.txt).*)",
  ],
};
