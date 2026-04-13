import prisma from "@/lib/prisma";
import mime from "mime";
import omit from "lodash/omit"
import { getStorageManager } from "@/lib/storage/manager";

export const revalidate = 7200;

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const file = await prisma.file.findFirst({
      where: {
        name: decodeURIComponent(params.id),
      },
    });

    if (!file) {
      return new Response(null, {
        status: 404,
      });
    }

    const mimeType = mime.getType(file?.name || "");
    const storageManager = getStorageManager();

    let buffer: Buffer;
    if (file.provider === 'pocketbase') {
      const fileBuffer = await storageManager.getFile(file.name, 'pocketbase');
      if (!fileBuffer) {
        return new Response(null, {
          status: 404,
        });
      }
      buffer = fileBuffer;
    } else {
      buffer = Buffer.from(file.data || []);
    }

    const blob = new Blob([buffer as any]);
    const stream = blob.stream();

    return new Response(stream, {
      headers: {
        "accept-ranges": "bytes",
        "Access-Control-Allow-Origin": "*",
        "content-length": String(blob.size),
        "Content-Type": mimeType as string,
      },
    });
  } catch (error) {
    return new Response(`error: ${error.message}`, {
      status: 400,
    });
  }
}

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
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

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const fileId = parseInt(params.id);
    const file = await prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      return new Response("File not found", {
        status: 404,
      });
    }

    const storageManager = getStorageManager();

    if (file.provider === 'pocketbase') {
      await storageManager.deleteFile(file.name, 'pocketbase');
    }

    await prisma.file.delete({ where: { id: fileId } });
    return new Response("ok", {
      status: 200,
    });
  } catch (error) {
    return new Response(`error: ${error.message}`, {
      status: 400,
    });
  }
}
