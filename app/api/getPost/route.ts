import { createPost, getPost } from "@/lib/server/posts";
import { isAuthenticated } from "@/lib/server/isAuthenticated";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { url } = request;
  const searchParamsId = new URL(url).searchParams.get('id')
  if (!searchParamsId) {
    return new NextResponse(
      JSON.stringify({
        success: false,
      }),
      {
        status: 400,
      }
    );
  }
  const id = parseInt(searchParamsId)
  if (
    Number.isNaN(id)
  ) {
    return new NextResponse(
      JSON.stringify({
        success: false,
      }),
      {
        status: 400,
      }
    );
  }

  const post = await getPost(id);

  if (post?.protected && !isAuthenticated(request)) {
    return new NextResponse("Authentication required", {
      status: 401,
      headers: { "WWW-Authenticate": "Basic" },
    });
  }

  return NextResponse.json(post);
}
