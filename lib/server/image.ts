import { getPlaiceholder } from "plaiceholder";
import sharp from "sharp";

export async function getSmallImage(imageBuffer: Buffer) {
  // 使用sharp库处理图片
  return await sharp(imageBuffer)
    .toFormat("jpeg") // 根据MIME类型设置输出格式
    .resize(100, 100) // 设置缩略图的尺寸，例如100x100像素
    .jpeg({ quality: 70 }) // 设置JPEG图片的质量，数值越低，图片质量越低
    .toBuffer()
    .then((buffer: Buffer) => {
      const mimeType = "image/jpeg";
      const dataURL = `data:${mimeType};base64,${buffer.toString("base64")}`;
      console.log(dataURL);
      return dataURL;
    });
}

export async function getBlurImage(buffer: Buffer) {
  const { base64 } = await getPlaiceholder(buffer);
  return base64;
}
export async function getImageBuffer(url: any) {
  return await fetch(url).then(async (res) =>
    Buffer.from(await res.arrayBuffer())
  );
}
