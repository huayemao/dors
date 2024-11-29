import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request, response: Response) {
  const json = await request.json();

  const res = await prisma.categories.create({
    data: json,
  });

  return NextResponse.json({ data: res });
}
