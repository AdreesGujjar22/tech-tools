import { NextResponse, type NextRequest } from "next/server";

const locales = ["de", "en", "es", "fr", "id", "it", "nl", "pt", "tr"];
const defaultLocale = "en";
const localeCookie = "techtools-locale";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const firstSegment = pathname.split("/")[1];

  let locale = defaultLocale;

  // Check if URL has a locale prefix - if so, use it
  if (locales.includes(firstSegment)) {
    locale = firstSegment;
  } else {
    // Otherwise, use cookie or default
    locale = request.cookies.get(localeCookie)?.value || defaultLocale;
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", locale);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.cookies.set(localeCookie, locale, { path: "/", maxAge: 60 * 60 * 24 * 365 });

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|robots.txt|sitemap.xml|llms.txt).*)",
  ],
};
