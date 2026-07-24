import { NextRequest, NextResponse } from "next/server";

const locales = new Set(["de", "en", "es", "fr", "id", "it", "nl", "pt", "tr"]);

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const firstSegment = pathname.split("/")[1];

  if (!locales.has(firstSegment)) {
    const url = request.nextUrl.clone();
    url.pathname = `/en${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  const internalPath = pathname.replace(/^\/(?:de|en|es|fr|id|it|nl|pt|tr)(?=\/|$)/, "") || "/";
  const url = request.nextUrl.clone();
  url.pathname = internalPath;

  // Forward x-locale on the rewritten request so server components
  // can read it via headers() from next/headers.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", firstSegment);

  return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!api|_next|admin(?:/|$)|.*\\..*).*)"],
};
