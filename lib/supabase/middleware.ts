import { NextResponse, type NextRequest } from "next/server";

const AUTH_COOKIE = "tal-auth";

const PUBLIC_PREFIXES = ["/login", "/auth", "/manifest.webmanifest", "/sw.js"];

export function updateSession(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublic = PUBLIC_PREFIXES.some((p) => path.startsWith(p));

  if (!isPublic && !request.cookies.get(AUTH_COOKIE)?.value) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next({ request });
}
