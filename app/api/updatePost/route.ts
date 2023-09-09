import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const id = formData.get("id");
  const content = formData.get("content");
  const title = formData.get("title");
  const changePhoto = formData.get("changePhoto");

  if (!Number.isNaN(parseInt(id as string))) {
    NextResponse.error();
  }

  await prisma.posts.update({
    where: {
      id: parseInt(id as string),
    },
    data: {
      content: content as string,
      title: title as string,
      cover_image: changePhoto === "on" ? {} : undefined,
    },
  });

  const path = new URL(("/posts/" + id) as string, request.url);

  revalidatePath("/posts/[id]");
  revalidatePath("/(content)/posts/[id]");

  return NextResponse.redirect(path);
}
