import { getPlaiceholder } from "plaiceholder";
import sharp from "sharp";
import prisma from "@/lib/prisma";
import { getStorageManager } from "@/lib/storage/manager";

export async function getSmallImage(imageBuffer: Buffer) {
  return await sharp(imageBuffer)
    .toFormat("jpeg")
    .resize(120, 120)
    .jpeg({ quality: 80 })
    .toBuffer()
    .then((buffer: Buffer) => {
      const mimeType = "image/jpeg";
      const dataURL = `data:${mimeType};base64,${buffer.toString("base64")}`;
      return dataURL;
    });
}

export async function getBlurImage(buffer: Buffer) {
  const { base64 } = await getPlaiceholder(buffer);
  return base64;
}

export async function getImageBuffer(url: any) {
  if (url?.startsWith('/api/files/')) {
    const id = url.split('/api/files/')[1];
    const file = await prisma.file.findFirst({
      where: {
        name: decodeURIComponent(id),
      },
    });
    if (file) {
      if (file.provider === 'pocketbase') {
        const storageManager = getStorageManager();
        const buffer = await storageManager.getFile(file.name, 'pocketbase');
        if (buffer) {
          return buffer;
        }
      } else {
        return Buffer.from(file.data || []);
      }
    }
  }
  return await fetch(url).then(async (res) => {
    return Buffer.from(await res.arrayBuffer());
  });
}
