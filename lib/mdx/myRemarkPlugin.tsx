import { h } from "hastscript";
import { visit } from "unist-util-visit";

export function myRemarkPlugin() {
  /**
   * @param {import('mdast').Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  return (tree) => {
    visit(tree, (node) => {
      if (node.type === "containerDirective" ||
        node.type === "leafDirective" ||
        node.type === "textDirective") {
        if (node.name !== "note") return;

        const data = node.data || (node.data = {});
        const tagName = node.type === "textDirective" ? "span" : "div";

        data.hName = tagName;
        if (!node.attributes.className) {
          node.attributes.className = [];
        }
        node.attributes.className.push("note");
        data.hProperties = h(tagName, node.attributes || {}).properties;
      }
    });
  };
}
