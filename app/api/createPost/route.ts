import { createPost } from "@/lib/posts";
import { revalidateHomePage } from "@/lib/utils/retalidate";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const content = formData.get("content");
  const excerpt = formData.get("excerpt");
  const title = formData.get("title");
  const categoryId = formData.get("category_id");
  const tags = formData.has("tags") ? formData.getAll("tags") : undefined;

  const post = await createPost(
    content as string,
    excerpt as string,
    title as string,
    categoryId as string,
    tags as string[]
  );

  await revalidateHomePage(post.id);

  const origin = request.headers.get("Origin");

  const path = new URL(("/posts/" + post.id) as string, origin || request.url);

  return NextResponse.redirect(path, 303);
}
