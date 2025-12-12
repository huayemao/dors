import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const json = await request.json();

  const res = await prisma.categories.create({
    data: json,
  });

  await revalidateTag('cats', { expire: 0 })
  return NextResponse.json({ data: res });
}
