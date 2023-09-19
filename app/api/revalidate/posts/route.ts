import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  revalidatePath("/posts/[id]");
  revalidatePath("/(content)/posts/[id]");

  return NextResponse.json({
    success: true,
  });
}
