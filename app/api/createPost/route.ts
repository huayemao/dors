import prisma from "@/prisma/client";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const content = formData.get("content");
  const title = formData.get("title");

  const { id } = await prisma.posts.create({
    data: {
      title: title as string,
      content: content as string,
    },
  });

  const path = ("/posts/" + id) as string;

  revalidatePath(path);

  return NextResponse.redirect(new URL(path, request.url));
}
