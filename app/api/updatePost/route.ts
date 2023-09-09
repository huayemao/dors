import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const content = formData.get("content");
  const id = formData.get("id");

  if (!Number.isNaN(parseInt(id as string))) {
    NextResponse.error();
  }

  await prisma.posts.update({
    where: {
      id: parseInt(id as string),
    },
    data: {
      content: content as string,
    },
  });

  return NextResponse.json(request);
}
