import { ClassValue, clsx } from "clsx";
import { remark } from "remark";
import html from "remark-html";
import excerpt from "strip-markdown";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function markdownToHtml(markdown) {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}

export async function markdownExcerpt(markdown) {
  const result = await remark().use(excerpt).process(markdown);
  return result.toString().slice(0, 100);
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
