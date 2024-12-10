import prisma from "@/lib/prisma";
import mime from "mime";

export const revalidate = 7200;

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

    const blob = new Blob([file!.data]);
    const stream = blob.stream();

    return new Response(stream, {
      headers: {
        "accept-ranges": "bytes",
        "Access-Control-Allow-Origin": "*",
        "content-length": String(blob.size),
        "Content-Type": mimeType as string,
      },
      // status: 200,
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
