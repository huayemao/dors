import prisma from "@/lib/prisma";
import mime from "mime";
import omit from "lodash/omit"
import { getStorageManager } from "@/lib/storage/manager";

export const revalidate = 7200;

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const url = new URL(request.url);
  const isThumbnail = url.searchParams.get('thumbnail') === 'true';
  
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

    // 使用新的 getFileStream 方法获取文件流，支持缩略图
    const fileStream = await storageManager.getFileStream(file.name, file.provider as any, isThumbnail);
    if (!fileStream) {
      return new Response(null, {
        status: 404,
      });
    }

    // 对于数据库存储，需要计算文件大小
    const contentLength = isThumbnail ? '100x100' : String(file.size || 0);

    return new Response(fileStream, {
      headers: {
        "accept-ranges": "bytes",
        "Access-Control-Allow-Origin": "*",
        "content-length": contentLength,
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
