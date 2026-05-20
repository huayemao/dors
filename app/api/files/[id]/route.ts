import prisma from "@/lib/prisma";
import mime from "mime";
import omit from "lodash/omit"
import { getStorageManager } from "@/lib/storage/manager";
import { revalidateTag } from "next/cache";

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
    const fileId = parseInt(params.id);
    const file = await prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      return new Response("文件不存在", { status: 404 });
    }

    const contentType = request.headers.get("content-type") || "";
    
    // 如果是 multipart/form-data，说明是更新文件内容
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const fileField = formData.get("file") as File;

      if (!fileField || !(fileField instanceof File)) {
        return new Response("未提供文件", { status: 400 });
      }

      const originalName = fileField.name;
      const buffer = Buffer.from(await fileField.arrayBuffer());
      const mimeType = mime.getType(originalName) || "unknown";
      const size = buffer.length;

      // 生成新的 hash 文件名
      const crypto = await import("crypto");
      const fileHash = crypto.createHash("sha256")
        .update(originalName + Date.now())
        .digest("hex")
        .substring(0, 16);
      const fileExtension = mime.getExtension(mimeType) || "";
      const hashedName = `${fileHash}${fileExtension ? "." + fileExtension : ""}`;

      // 删除旧文件
      const storageManager = getStorageManager();
      if (file.provider === 'pocketbase') {
        await storageManager.deleteFile(file.name, 'pocketbase');
      }

      // 保存新文件
      const metadata = await storageManager.saveFile({
        buffer,
        fileName: hashedName,
        mimeType,
        size,
      });

      // 更新数据库记录
      const updatedFile = await prisma.file.update({
        where: { id: fileId },
        data: {
          name: hashedName,
          displayName: originalName,
          mimeType,
          size: BigInt(size),
          provider: metadata.provider,
          data: metadata.provider === 'database' ? buffer : undefined,
        },
      });

      revalidateTag('files', {});

      return new Response(JSON.stringify(omit(updatedFile, 'data')), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      // JSON 格式，更新文件名
      const { displayName } = await request.json();

      if (!displayName || displayName.trim() === "") {
        return new Response("显示文件名不能为空", { status: 400 });
      }

      const updatedFile = await prisma.file.update({
        where: { id: fileId },
        data: { displayName: displayName.trim() },
      });

      revalidateTag('files', {});

      return new Response(JSON.stringify(omit(updatedFile, 'data')), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    return new Response(`更新失败：${error.message}`, { status: 500 });
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
