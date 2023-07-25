import { ClassValue, clsx } from "clsx";
import { remark } from "remark";
import html from "remark-html";
import excerpt from "strip-markdown";
import { twMerge } from "tailwind-merge";
import { PexelsPhoto } from "./types/PexelsPhoto";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getBase64Image(url) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64 = buffer.toString("base64");
  const contentType = response.headers.get("content-type");
  const dataUrl = `data:${contentType};base64,${base64}`;
  return dataUrl;
}

export async function getPexelImages(
  length
): Promise<{ photos: PexelsPhoto[] }> {
  return await fetch(
    `https://api.pexels.com/v1/search?query=pastel&per_page=${length}&page=${
      Math.floor(Math.random() * 100) + 1
    }&orientation=landscape`,
    {
      headers: {
        Authorization:
          "VIIq3y6ksXWUCdBRN7xROuRE7t6FXcX34DXyiqjnsxOzuIakYACK402j",
      },
    }
  ).then((res) => res.json());
}

export async function markdownToHtml(markdown) {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}

export async function markdownExcerpt(markdown) {
  const result = await remark().use(excerpt).process(markdown);
  return result.toString().slice(0, 100);
}

export function getWordCount(htmlContent) {
  // 去除 HTML 标签
  const textContent = htmlContent.replace(/<[^>]+>/g, "");
  // 统计字数，汉字不以空格分隔
  const wordCount = textContent.trim().replaceAll(/\s+/g, "").length;
  // const wordCount = textContent.trim().split(/\s+/).length;
  return wordCount;
}

export function humanFileSize(size) {
  const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  let i = 0;
  while (size >= 1024) {
    size /= 1024;
    ++i;
  }
  return `${size.toFixed(2)} ${units[i]}`;
}

export function getDateString(date: Date) {
  const year = date.getFullYear(); // 获取年份
  const month = date.getMonth() + 1; // 获取月份（加 1 是因为月份从 0 开始）
  const day = date.getDate(); // 获取日期
  const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")}`;
  return formattedDate;
}
