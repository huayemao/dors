"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

// 高亮显示数字
function highlightNumbers(element) {
  // 获取元素节点的文本内容
  let text = element.data;
  if (!text) return;
  // 使用正则表达式匹配数字
  let regex = /\p{N}/gu;
  let matches = text.match(regex);
  if (matches) {
    // 遍历匹配到的数字
    for (let i = 0; i < matches.length; i++) {
      let number = matches[i];
      // 创建一个带有高亮样式的 <span> 元素
      let span = document.createElement("span");
      span.innerHTML = number;
      span.style.backgroundColor = "yellow";
      span.style.fontWeight = "bold";
      // 替换文本中的数字为带有高亮样式的 <span> 元素，重复的也要替换
      text = text.replaceAll(number, span.outerHTML);
    }
    // 更新元素节点的文本内容
    element.parentElement.innerHTML = text;
  }
}
function traverseTextNodes(element) {
  // 检查当前节点是否为文本节点
  if (element.nodeType === Node.TEXT_NODE) {
    highlightNumbers(element);
  }
  // 遍历当前节点的子节点
  for (let i = 0; i < element.childNodes.length; i++) {
    const childNode = element.childNodes[i];
    // 递归调用遍历函数，处理子节点
    traverseTextNodes(childNode);
  }
}

const handleBtnClick = () => {
  const articleEl = document.querySelector("article");
  traverseTextNodes(articleEl);
};

export const DigitsHighlightButton: React.FC = () => {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const article = document.querySelector("article");
    if (!article || !article.textContent?.match(/\p{N}/gu)) {
      setHidden(true);
    }
  }, []);
  return (
    <button
      onClick={handleBtnClick}
      className={cn({
        hidden,
      })}
    >
      高亮数字
    </button>
  );
};
