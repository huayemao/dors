import { type Item } from "./CollectionEditor";


export function markdownToJson(markdownText) {
  const lines = markdownText.split("\n");
  const jsonArr: Item[] = [];
  let currentContent: string[] = [];
  let lastTag = "";

  const headerRegex = /^## (.*)/; // 匹配Markdown的二级标题
  const separatorRegex = /^---$/; // 匹配分隔线

  function patchItem() {
    if (!lastTag) {
      return;
    }
    const targetItem = jsonArr.find(
      (e) => e.content == currentContent.join("\n")
    );
    if (targetItem) {
      targetItem.tags.push(lastTag);
    } else {
      jsonArr.push({
        tags: [lastTag],
        content: currentContent.join("\n"),
      });
    }
  }

  lines.forEach((line) => {
    const headerMatch = line.match(headerRegex);
    const separatorMatch = line.match(separatorRegex);
    console.log(lastTag, currentContent);
    if (headerMatch) {
      // 找到新的标题，保存之前的内容
      if (currentContent[0]?.length > 0) {
        patchItem();
      }
      lastTag = headerMatch[1].trim();
      // 重置内容数组
      currentContent = [];
    } else if (separatorMatch) {
      // 找到分隔符，保存当前内容，并添加新标签
      if (currentContent[0]?.length > 0) {
        patchItem();
      }
      currentContent = []; // 重置内容数组
    } else {
      // 收集内容
      currentContent.push(line);
    }
  });

  // 添加最后一个条目
  if (currentContent[0]?.length > 0) {
    patchItem();
  }

  return jsonArr;
}
