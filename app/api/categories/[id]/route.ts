import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function PUT(request: Request, response: Response) {
  const json = await request.json() as { id: number, name: string, meta: any };

  const url = new URL(request.url);
  const id = url.pathname.split('/').pop();
  const res = await prisma.categories.update({
    data: json,
    where: { id: Number(id) },
  });

  revalidateTag('cats')
  return NextResponse.json({ data: res });
}
