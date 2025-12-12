import TurndownService from "turndown";

export function transformHTML2MDX(content: string) {
  // 简单的HTML到JSX字符串转换函数
  const htmlToJSX = (html: string) => {
    // 对于简单的转换，我们可以直接返回HTML字符串
    // Turndown会处理它
    return html;
  };

  const turndownService = new TurndownService({
    headingStyle: "atx",
  });
  turndownService.addRule("removeStyleEl", {
    filter: function (node, options) {
      return node.tagName == "STYLE";
    },
    replacement: function (content, node) {
      return "";
    },
  });
  // todo:markdown 需要是 jsx 。。。
  turndownService.addRule("keepStyle", {
    filter: function (node, options) {
      return node.getAttribute("style");
    },
    replacement: function (content, node) {
      const output = htmlToJSX(node.outerHTML);
      return output;
    },
  });

  const tmp = document.createElement("div");
  tmp.innerHTML = content;
  const md = turndownService.turndown(
    tmp.querySelector("article")?.innerHTML || tmp.innerHTML
  );
  return md;
}