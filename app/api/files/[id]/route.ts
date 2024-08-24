import prisma from "@/lib/prisma";
import mime from "mime";
import { unstable_cache } from "next/cache";

export const revalidate = 4000;

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const file = await unstable_cache(prisma.file.findFirst)({
      where: {
        name: decodeURIComponent(params.id),
      },
    });

    if (!file) {
      new Response(null, {
        status: 404,
      });
    }

    const mimeType = mime.getType(file?.name || "");

    return new Response(file?.data, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": mimeType as string,
      },
      status: 200,
    });
  } catch (error) {
    return new Response(`error: ${error.message}`, {
      status: 400,
    });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.file.delete({ where: { id: Number(params.id) } });
    return new Response("ok", {
      status: 200,
    });
  } catch (error) {
    return new Response(`error: ${error.message}`, {
      status: 400,
    });
  }
}
