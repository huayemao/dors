import { type Item } from "./CollectionEditor";


export function markdownToJson(markdownText: string) {
  const lines = markdownText.split("\n");
  const jsonArr: Item[] = [];
  let currentContent: string[] = [];
  let lastTag = "";

  const headerRegex = /^## (.*)/; // 匹配Markdown的二级标题
  const separatorRegex = /^---$/; // 匹配分隔线

  function patchItem() {
    if (!lastTag || !currentContent.join("\n").trim()) {
      return;
    }
    const targetItem = jsonArr.find(
      (e) => e.content.trim() == currentContent.join("\n").trim()
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
  const isList = (lines.filter(e => !!e?.trim() && !e.startsWith('#')).every(l => l.startsWith('+ ')))

  lines.forEach((line, i) => {
    const headerMatch = line.match(headerRegex);
    const separatorMatch = line.match(separatorRegex);
    // console.log(lastTag, currentContent);
    if (headerMatch) {
      // 找到新的标题，保存之前的内容
      patchItem();
      lastTag = headerMatch[1].trim();
      // 重置内容数组
      currentContent = [];
    }

    else if (separatorMatch) {
      // 找到分隔符，保存当前内容，并添加新标签
      patchItem();
      currentContent = []; // 重置内容数组
    }

    else if (isList && line.startsWith('+ ')) {
      currentContent.push(line);
      patchItem();
      currentContent = []; // 重置内容数组
    }

    else {
      // 收集内容
      currentContent.push(line);
    }
  });

  // 添加最后一个条目
  patchItem();

  return jsonArr;
}
