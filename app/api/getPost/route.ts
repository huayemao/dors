import { createPost, getPost } from "@/lib/posts";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
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

  return NextResponse.json(post);
}
