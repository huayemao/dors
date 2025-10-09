import prisma from "@/lib/prisma";
import mime from "mime";
import omit from "lodash/omit"

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

    // @ts-ignore
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

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { displayName } = await request.json();

    if (!displayName || displayName.trim() === "") {
      return new Response("显示文件名不能为空", { status: 400 });
    }

    const fileId = parseInt(params.id);
    const updatedFile = await prisma.file.update({
      where: { id: fileId },
      data: { displayName: displayName.trim() },
    });


    return new Response((omit(updatedFile, 'data')), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(`更新失败: ${error.message}`, { status: 500 });
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
