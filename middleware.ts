import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { isAuthenticated } from "./lib/server/isAuthenticated";


// Step 1. HTTP Basic Auth Middleware for Challenge
export function middleware(req: NextRequest) {
  const basicAuthPathSuffixes = ["/api", "/admin", "/protected"];
  const whiteList = ["/api/files", "/api/getPost"];

  if (
    basicAuthPathSuffixes.some((suffix) =>
      req.nextUrl.pathname.startsWith(suffix)
    )
  ) {
    if (
      !isAuthenticated(req) &&
      !whiteList.some((e) => req.nextUrl.pathname.startsWith(e))
    ) {
      return new NextResponse("Authentication required", {
        status: 401,
        headers: { "WWW-Authenticate": "Basic" },
      });
    }
  }

  return NextResponse.next();
}

