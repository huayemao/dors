import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let key: string | null = null;
  let value: any = null;

  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      const body = await request.json();
      key = body.key;
      value = body.value;
    } catch {
      return new NextResponse("Invalid JSON", { status: 400 });
    }
  } else {
    const formData = await request.formData();
    key = formData.get("key") as string;
    value = formData.getAll("value") as string[];
  }

  if (!key || value === undefined || value === null) {
    return new NextResponse(null, { status: 400 });
  }

  try {
    const res = await prisma.settings.upsert({
      where: {
        key: key,
      },
      update: {
        value: value,
      },
      create: {
        key: key,
        value: value,
      },
    });
    await revalidateTag('settings_' + key, { expire: 0 });
    return NextResponse.json(res);
  } catch (error) {
    console.error("Failed to save settings:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

