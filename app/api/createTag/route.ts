import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const name = formData.get("name");

  if (!(name as string).trim()) {
    return new NextResponse(null, { status: 400 });
  }

  const tag = await prisma.tags.create({
    data: {
      name: name as string,
    },
  });

  const origin = request.headers.get("Origin");

  const path = new URL(("/tags/" + tag.id) as string, origin || request.url);

  return NextResponse.redirect(path, 303);
}
