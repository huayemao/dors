import { h } from "hastscript";
import { visit } from "unist-util-visit";

export function directiveAdapterPlugin() {
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

        const data = node.data || (node.data = {});
        const tagName = node.type === "textDirective" ? "span" : "div";

        data.hName = tagName;
        node.attributes["data-remark-directive"] = node.name;
        data.hProperties = h(tagName, node.attributes || {}).properties;
      }
    });
  };
}
