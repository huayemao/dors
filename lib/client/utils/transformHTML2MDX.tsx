import HTMLtoJSX from "htmltojsx";
import TurndownService from "turndown";

export function transformHTML2MDX(content: string) {
  var converter = new HTMLtoJSX({
    createClass: false,
  });

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
      const output = converter.convert(node.outerHTML);
      return output;
    },
  });

  const tmp = document.createElement("div");
  tmp.innerHTML = content;
  const md = turndownService.turndown(tmp.querySelector("article")?.innerHTML);
  return md;
}
