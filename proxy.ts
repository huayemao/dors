import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { isAuthenticated } from "./lib/server/isAuthenticated";

export function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const method = req.method;

  // Check if route is explicitly public read-only
  const isPublicGetPost = pathname === "/api/getPost" && method === "POST";
  const isPublicSearch = pathname === "/api/search" && method === "POST";
  const isPublicFileRead =
    (pathname.startsWith("/api/files/") || pathname === "/api/files") &&
    method === "GET" &&
    !pathname.startsWith("/api/files/migrate");

  const isPublicRoute = isPublicGetPost || isPublicSearch || isPublicFileRead;

  if (!isPublicRoute && !isAuthenticated(req)) {
    return new NextResponse("Authentication required", {
      status: 401,
      headers: { "WWW-Authenticate": "Basic" },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/protected/:path*", "/api/:path*", "/admin/:path*", "/diaries/:path*"],
};

