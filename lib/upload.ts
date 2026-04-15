import prisma from "@/lib/prisma";
import mime from "mime";
import sharp from "sharp";
import crypto from "crypto";
import { getStorageManager } from "@/lib/storage/manager";

export interface UploadedFile {
  id: number;
  name: string;
  displayName: string;
  mimeType: string;
  size: bigint;
  markdown: string;
}

export async function processFileUpload(files: File[], uploadOriginal?: boolean): Promise<UploadedFile[]> {
  const uploadedFiles: UploadedFile[] = [];

  for (const item of files) {
    if (item instanceof File) {
      const originalName = item.name;
      const buffer = Buffer.from(await item.arrayBuffer());
      let processedBuffer = buffer;
      let processedMimeType = mime.getType(originalName) || "unknown";
      let processedSize = item.size;

      // 检查是否为图片并进行压缩
      if (processedMimeType.startsWith("image/") && processedMimeType !== "image/svg+xml" && processedMimeType !== "image/gif" && !uploadOriginal) {
        // 300KB 以下的图片不压缩
        if (item.size > 300 * 1024) {
          try {
            let sharpInstance = sharp(buffer);

            // 获取图片信息
            const metadata = await sharpInstance.metadata();
            
            // 控制图片像素大小，宽不超过 3200px
            if (metadata.width && metadata.width > 3200) {
              sharpInstance = sharpInstance.resize({
                width: 3200,
                fit: 'inside',
                withoutEnlargement: true
              });
            }

            // 转换为webp格式，90%质量
            processedBuffer = Buffer.from(await sharpInstance
              .webp({ quality: 90 })
              .toBuffer());

            processedMimeType = "image/webp";
            processedSize = processedBuffer.length;
          } catch (error) {
            console.warn("图像压缩失败，使用原文件:", error);
            // 如果压缩失败，使用原文件
            processedBuffer = buffer;
          }
        }
      }

      // 生成hash文件名
      const fileHash = crypto.createHash("sha256")
        .update(originalName + Date.now())
        .digest("hex")
        .substring(0, 16);
      const fileExtension = processedMimeType === "image/webp" ? "webp" :
        (mime.getExtension(processedMimeType) || "");
      const hashedName = `${fileHash}${fileExtension ? "." + fileExtension : ""}`;

      const storageManager = getStorageManager();
      const metadata = await storageManager.saveFile({
        buffer: processedBuffer,
        fileName: hashedName,
        mimeType: processedMimeType,
        size: processedSize,
      });

      const file = await prisma.file.create({
        data: {
          name: hashedName,
          displayName: originalName,
          mimeType: processedMimeType,
          size: BigInt(processedSize),
          provider: metadata.provider,
          data: metadata.provider === 'database' ? processedBuffer : undefined,
        },
      });

      const url = encodeURI(`/api/files/${file.name}`);
      const markdown = `![${file.displayName}](${url})`;

      uploadedFiles.push({
        id: file.id,
        name: file.name,
        displayName: file.displayName,
        mimeType: file.mimeType,
        size: file.size || BigInt(0),
        markdown,
      });
    }
  }

  return uploadedFiles;
}
