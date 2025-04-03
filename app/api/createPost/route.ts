import { createPost } from "@/lib/server/posts";
import { revalidateHomePage } from "@/lib/server/retalidate";
import { NextResponse } from "next/server";
import { readPostFormData } from "../updatePost/readPostFormData";
import { markdownExcerpt } from "@/lib/isomorphic/getExcerpt";

export async function POST(request: Request) {
  const formData = await request.formData();
  const {
    id,
    content,
    excerpt,
    title,
    changePhoto,
    protectedStr,
    updated_at,
    created_at,
    category_id: categoryId,
    tags,
    type,
  } = readPostFormData(formData);

  const post = await createPost({
    type: type!,
    content,
    excerpt: excerpt ?? await markdownExcerpt(content),
    title,
    categoryId,
    tags,
    isProtected: protectedStr
      ? protectedStr === "on"
        ? true
        : false
      : undefined,
  });

  await revalidateHomePage(post.id);

  const origin = request.headers.get("Origin");

  const path = new URL(("/posts/" + post.id) as string, origin || request.url);

  return NextResponse.redirect(path, 303);
}
