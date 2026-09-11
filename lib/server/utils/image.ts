import { getPlaiceholder } from "plaiceholder";
import sharp from "sharp";
import prisma from "@/lib/prisma";
import { getStorageManager } from "@/lib/storage/manager";
import { isDataURL } from "@/lib/utils";
import fs from "fs";
import path from "path";

const FALLBACK_BASE64_PIXEL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

export async function getSmallImage(imageBuffer: Buffer): Promise<string> {
  try {
    const buffer = await sharp(imageBuffer)
      .toFormat("jpeg")
      .resize(120, 120)
      .jpeg({ quality: 80 })
      .toBuffer();
    const mimeType = "image/jpeg";
    return `data:${mimeType};base64,${buffer.toString("base64")}`;
  } catch (error) {
    console.warn("Failed to generate small image thumbnail:", error);
    return FALLBACK_BASE64_PIXEL;
  }
}

export async function getBlurImage(buffer: Buffer): Promise<string> {
  try {
    const { base64 } = await getPlaiceholder(buffer);
    return base64;
  } catch (error) {
    console.warn("Failed to generate blur placeholder:", error);
    return FALLBACK_BASE64_PIXEL;
  }
}

export async function getImageBuffer(url: any): Promise<Buffer> {
  if (!url || typeof url !== "string") {
    throw new Error(`Invalid image URL: ${url}`);
  }

  // 1. Local uploaded file via /api/files/
  if (url.startsWith("/api/files/")) {
    const id = url.split("/api/files/")[1];
    const file = await prisma.file.findFirst({
      where: {
        name: decodeURIComponent(id),
      },
    });
    if (file) {
      if (file.provider === "pocketbase") {
        const storageManager = getStorageManager();
        const buffer = await storageManager.getFile(file.name, "pocketbase");
        if (buffer) {
          return buffer;
        }
      } else if (file.data) {
        return Buffer.from(file.data);
      }
    }
    throw new Error(`File not found for ${url}`);
  }

  // 2. Data URL
  if (isDataURL(url)) {
    const base64Part = url.split(",")[1];
    if (base64Part) {
      return Buffer.from(base64Part, "base64");
    }
    throw new Error("Invalid base64 data URL");
  }

  // 3. Local file in public/ directory
  if (url.startsWith("/")) {
    const cleanPath = url.split("?")[0].replace(/^\//, "");
    const localFilePath = path.join(process.cwd(), "public", cleanPath);
    if (fs.existsSync(localFilePath)) {
      return await fs.promises.readFile(localFilePath);
    }
    throw new Error(`Local file not found: ${localFilePath}`);
  }

  // 4. Remote HTTP/HTTPS URL
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; DorsBot/1.0)",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch image (${res.status} ${res.statusText}): ${url}`);
    }

    const arrayBuffer = await res.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } finally {
    clearTimeout(timeoutId);
  }
}
