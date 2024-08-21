"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

// let regex = /\p{N}/gu;
let regex =
  /[\u0030-\u0039\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0BE6-\u0BEF\u0C66-\u0C6F\u0CE6-\u0CEF\u0D66-\u0D6F\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F29\u1040-\u1049\u1090-\u1099\u17E0-\u17E9\u1810-\u1819\u1946-\u194F\u19D0-\u19D9\u1A80-\u1A89\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\uA620-\uA629\uA8D0-\uA8D9\uA900-\uA909\uAA50-\uAA59\uFF10-\uFF19]/g;

// 高亮显示数字
function highlightNumbers(element) {
  // 获取元素节点的文本内容
  let text = element.data;
  if (!text) return;
  // 使用正则表达式匹配数字
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
    if (!article || !article.textContent?.match(regex)) {
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
