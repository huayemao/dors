import prisma from "@/lib/prisma";
import mime from "mime";

export const revalidate = 60 * 60;

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const file = await prisma.file.findFirst({
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
