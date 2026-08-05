import { NextResponse, type NextRequest } from "next/server";

const locales = ["de", "en", "es", "fr", "id", "it", "nl", "pt", "tr"];
const localeCookie = "techtools-locale";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const firstSegment = pathname.split("/")[1];

  if (locales.includes(firstSegment)) {
    const restOfPath = pathname.split("/").slice(2).join("/");
    const target = request.nextUrl.clone();
    target.pathname = restOfPath ? `/${restOfPath}` : "/";

    const response = NextResponse.redirect(target);
    response.cookies.set(localeCookie, firstSegment, { path: "/", maxAge: 60 * 60 * 24 * 365 });
    return response;
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", request.cookies.get(localeCookie)?.value || "en");

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|robots.txt|sitemap.xml|llms.txt).*)",
  ],
};
