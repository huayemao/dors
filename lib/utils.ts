import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { remark } from "remark";
import html from "remark-html";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function markdownToHtml(markdown) {
  const result = await remark().use(html).process(markdown);
  return result.toString();
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
