import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const key = formData.get("key") as string;
  const value = formData.getAll("value") as string[];

  if (!key || !value) {
    return new NextResponse(null, { status: 400 });
  }

  try {
    const res = await prisma.settings.update({
      where: {
        key: key,
      },
      data: {
        key,
        value: value,
      },
    });
    await revalidateTag('settings_' + key,  { expire: 0 })
    return NextResponse.json(res);
  } catch (error) {
    if (error.code === "P2025") {
      const res = await prisma.settings.create({
        data: {
          key,
          value: value,
        },
      });

      return NextResponse.json(res);
    }
    console.error(error)
  }
}
