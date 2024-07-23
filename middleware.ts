import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const [AUTH_USER, AUTH_PASS] = (process.env.HTTP_BASIC_AUTH || ":").split(":");

// Step 1. HTTP Basic Auth Middleware for Challenge
export function middleware(req: NextRequest) {
  const basicAuthPathSuffixes = ["/api", "/admin", "/protected"];
  const whiteList = ["/api/files"];

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

function isAuthenticated(req: NextRequest) {
  const authheader =
    req.headers.get("authorization") || req.headers.get("Authorization");

  if (!authheader) {
    return false;
  }

  const auth = Buffer.from(authheader.split(" ")[1], "base64")
    .toString()
    .split(":");
  const user = auth[0];
  const pass = auth[1];

  if (user == AUTH_USER && pass == AUTH_PASS) {
    return true;
  } else {
    return false;
  }
}
