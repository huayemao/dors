import prisma from "@/lib/prisma";
import { updateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const json = await request.json();

  const res = await prisma.categories.create({
    data: json,
  });

  await updateTag('cats')
  return NextResponse.json({ data: res });
}
