import { NextResponse, type NextRequest } from "next/server";

const AUTH_COOKIE = "tal-auth";
const MAX_AGE = 60 * 60 * 24 * 90; // 90 days

export async function POST(request: NextRequest) {
  const { password } = await request.json();
  const sitePassword = process.env.SITE_PASSWORD;

  if (!sitePassword || password !== sitePassword) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(AUTH_COOKIE, "ok", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  });
  return response;
}
