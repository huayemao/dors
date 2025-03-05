import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request, response: Response) {
  const json = await request.json();

  const res = await prisma.categories.create({
    data: json,
  });

  revalidateTag('cats')
  return NextResponse.json({ data: res });
}
