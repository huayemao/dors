import prisma from "@/lib/prisma";
import mime from "mime";
import sharp from "sharp";
import crypto from "crypto";

export const maxDuration = 25;

export const revalidate = 1200;

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const href = searchParams.get("href");
  if (href) {
    // todo: 这里只是想整个代理功能，现在 47.XXX 这台主机已经不用了，就用当前的服务器来代理
    const newHref = href
      .replace("//", "//47.114.89.18:8993/suburl/")
      .replaceAll("https", "http");
    const paths = [decodeURIComponent(href), decodeURIComponent(newHref)];
    const resPromises = paths.map(async (e) => {
      const res = await fetch(e);
      return new Response(await res.arrayBuffer());
    });
    return Promise.race(resPromises);
  }

  return new Response(``, {
    status: 400,
  });
}

export async function POST(request: Request) {
  try {
    const files = (await request.formData()).getAll("files");
    const markdown: string[] = [];

    for (const item of files) {
      if (item instanceof File) {
        const originalName = item.name;
        const buffer = Buffer.from(await item.arrayBuffer());
        let processedBuffer = buffer;
        let processedMimeType = mime.getType(originalName) || "unknown";
        let processedSize = item.size;

        // 检查是否为图片并进行压缩
        if (processedMimeType.startsWith("image/") && processedMimeType !== "image/svg+xml") {
          try {
            const sharpInstance = sharp(buffer);

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

        // 生成hash文件名
        const fileHash = crypto.createHash("sha256")
          .update(originalName + Date.now())
          .digest("hex")
          .substring(0, 16);
        const fileExtension = processedMimeType === "image/webp" ? "webp" :
          (mime.getExtension(processedMimeType) || "");
        const hashedName = `${fileHash}${fileExtension ? "." + fileExtension : ""}`;

        const file = await prisma.file.create({
          data: {
            name: hashedName,
            displayName: originalName,
            data: processedBuffer,
            mimeType: processedMimeType,
            size: BigInt(processedSize),
          },
        });

        const url = encodeURI(`/api/files/${file.name}`);
        const markdownText = `![${file.displayName}](${url})`;
        markdown.push(markdownText);
      }
    }

    return new Response(markdown.join("\n"), {
      status: 200,
    });
  } catch (error) {
    return new Response(`error: ${error.message}`, {
      status: 400,
    });
  }
}


