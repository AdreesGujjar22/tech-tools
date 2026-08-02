import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["de", "en", "es", "fr", "id", "it", "nl", "pt", "tr"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameSegments = pathname.split("/");
  const firstSegment = pathnameSegments[1];

  if (locales.includes(firstSegment)) {
    const locale = firstSegment;
    const restOfPath = pathnameSegments.slice(2).join("/");
    const targetPath = restOfPath ? `/${restOfPath}` : "/";

    const response = NextResponse.rewrite(new URL(targetPath, request.url));
    response.headers.set("x-locale", locale);
    return response;
  }

  const response = NextResponse.next();
  response.headers.set("x-locale", "en");
  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|robots.txt|sitemap.xml|llms.txt).*)",
  ],
};
