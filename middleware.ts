import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Run on all paths except Next internals and static assets.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|icon-maskable.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
