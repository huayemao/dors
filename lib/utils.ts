import { ClassValue, clsx } from "clsx";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import { remark } from "remark";
import html from "remark-html";
import excerpt from "strip-markdown";
import { twMerge } from "tailwind-merge";
import { PexelsPhoto } from "./types/PexelsPhoto";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getPexelImages(
  length
): Promise<{ photos: PexelsPhoto[] }> {
  const keywordArr = [
    "pastel",
    "pure",
    "minimalist",
    "wallpaper",
    "bright",
    "minimalistic",
    "design",
  ];
  const query = keywordArr[Math.floor(Math.random() * keywordArr.length)];
  return await fetch(
    `https://api.pexels.com/v1/search?query=${query}&per_page=${length}&page=${
      Math.floor(Math.random() * (888 / length)) + 1
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

export async function sleep(s: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, s);
  });
}

export async function markdownExcerpt(markdown) {
  const result = await remark().use(excerpt).process(markdown);
  return result.toString().slice(0, 100);
}

export function getWordCount(htmlContent) {
  // 去除 HTML 标签
  const textContent = htmlContent?.replace(/<[^>]+>/g, "");
  // 统计字数，汉字不以空格分隔
  const wordCount = textContent?.trim().replaceAll(/\s+/g, "").length;
  // const wordCount = textContent.trim().split(/\s+/).length;
  return wordCount;
}

export function humanFileSize(size: number | bigint) {
  const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  let i = 0;
  while (size >= 1024) {
    if (typeof size == "bigint") {
      size /= BigInt(1024);
    } else {
      size /= 1024;
    }
    ++i;
  }

  return `${size} ${units[i]}`;
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

export function getDateForDateTimeInput(date: Date): string {
  dayjs.extend(timezone);
  return dayjs(date).format("YYYY-MM-DDTHH:mm");
}

export async function copyTextToClipboard(text) {
  if ("clipboard" in navigator) {
    return await navigator.clipboard.writeText(text);
  } else {
    return document.execCommand("copy", true, text);
  }
}

export async function readFromClipboard() {
  return await navigator.clipboard.readText();
}

export function withConfirm<T extends Function>(fn: T) {
  const res = confirm("确定吗？");
  if (!res) {
    return;
  }
  fn();
}

export function getCurrentSegmentContent(el: HTMLElement) {
  let str = el.outerHTML;
  let current = el.nextElementSibling;
  const test = (tName) =>
    tName.startsWith("H") && Number(tName[1]) <= Number(el.tagName[1]);
  while (current && !test(current.tagName)) {
    str += current.outerHTML;
    current = current.nextElementSibling;
  }
  return str;
}

export function isValidURL(string) {
  try {
    new URL(string);
    return true;
  } catch (e) {
    return false;
  }
}

export function isDataURL(url) {
  var regex =
    /^data:([a-zA-Z0-9]+\/[a-zA-Z0-9+.-]+)?(;charset=[a-zA-Z0-9\-]+)?;base64,[a-zA-Z0-9+/]+={0,2}$/;
  return regex.test(url);
}