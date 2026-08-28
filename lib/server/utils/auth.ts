import type { NextRequest } from "next/server";
import crypto from "crypto";

const HTTP_AUTH = process.env.HTTP_BASIC_AUTH;
const [AUTH_USER, AUTH_PASS] = (HTTP_AUTH || "").split(":");

export function isAuthenticated(req: NextRequest) {
  if (!HTTP_AUTH || !AUTH_USER || !AUTH_PASS) {
    return false;
  }

  const authheader = req.headers.get("authorization") || req.headers.get("Authorization");

  if (!authheader || !authheader.startsWith("Basic ")) {
    return false;
  }

  try {
    const credentials = Buffer.from(authheader.split(" ")[1], "base64")
      .toString("utf-8")
      .split(":");
    const user = credentials[0] || "";
    const pass = credentials.slice(1).join(":") || "";

    const userBuffer = Buffer.from(user);
    const authUserBuffer = Buffer.from(AUTH_USER);
    const passBuffer = Buffer.from(pass);
    const authPassBuffer = Buffer.from(AUTH_PASS);

    if (
      userBuffer.length === authUserBuffer.length &&
      passBuffer.length === authPassBuffer.length &&
      crypto.timingSafeEqual(userBuffer, authUserBuffer) &&
      crypto.timingSafeEqual(passBuffer, authPassBuffer)
    ) {
      return true;
    }
  } catch {
    return false;
  }

  return false;
}
