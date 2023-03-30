import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/files/:path*"],
};

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get("authorization");
  const url = req.nextUrl;

  if (basicAuth) {
    const authValue = basicAuth.split(" ")[1];
    const [user, pwd] = atob(authValue).split(":");

    if (user === "4dmin" && pwd === "testpwd123") {
      // todo：从这里去登陆，然后返回 bearer? 还不如在客户端呢。。。
      // 反正肯定要 useEffect 的。。。
      return NextResponse.next();
    }
  }
  url.pathname = "/api/auth";

  return NextResponse.rewrite(url);
}
