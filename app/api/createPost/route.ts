import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const content = formData.get("content");
  const title = formData.get("title");
  const categoryId = formData.get("category");

  const { id } = await prisma.posts.create({
    data: {
      content: content as string,
      title: title as string,
      created_at: new Date(),
      updated_at: new Date(),
      posts_category_links: {
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
