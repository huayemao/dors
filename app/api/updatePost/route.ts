import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const id = formData.get("id");
  const content = formData.get("content");
  const title = formData.get("title");
  const changePhoto = formData.get("changePhoto");
  const categoryId = formData.get("category");
  const updated_at = formData.get("updated_at");

  if (!Number.isNaN(parseInt(id as string))) {
    NextResponse.error();
  }
  // todo: 应该有 diff 的
  const res = await prisma.posts.update({
    where: {
      id: parseInt(id as string),
    },
    data: {
      content: content as string,
      title: title as string,
      cover_image: changePhoto === "on" ? {} : undefined,
      updated_at: updated_at ? new Date(updated_at as string) : new Date(),
      posts_category_links: {
        deleteMany: { post_id: parseInt(id as string) },
        create: {
          category_id: parseInt(categoryId as string),
        },
      },
    },
  });

  const path = new URL(("/posts/" + id) as string, request.url);

  revalidatePath("/");
  revalidatePath("/posts/[id]");
  revalidatePath("/(content)/posts/[id]");

  return NextResponse.redirect(path);
}
