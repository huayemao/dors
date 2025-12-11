import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const json = await request.json() as { id: number, name: string, meta: any };

  const res = await prisma.categories.update({
    data: json,
    where: { id: Number(params.id) },
  });

  revalidateTag('cats')
  return NextResponse.json({ data: res });
}
