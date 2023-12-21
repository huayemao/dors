import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  revalidatePath("/posts/[id]",'page');
  revalidatePath("/(content)/posts/[id]",'page');

  return NextResponse.json({
    success: true,
  });
}
