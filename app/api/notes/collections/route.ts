import { getPosts } from "@/lib/server/posts";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const posts = await getPosts({ type: 'collection', includeHiddenCategories: true, perPage: 1000 });
  return NextResponse.json(posts);
}
