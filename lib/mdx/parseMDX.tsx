import { nodeTypes } from "@mdx-js/mdx";
// import { serialize } from "next-mdx-remote/serialize";
import { compileMDX } from "next-mdx-remote/rsc";
//@ts-ignore
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkShikiTwoslash from "remark-shiki-twoslash";
const theme = require("shiki/themes/nord.json");


import { h } from "hastscript";
import remarkDirective from "remark-directive";
import remarkMath from "remark-math";
import { visit } from "unist-util-visit";
import { components } from "./useComponents";

function myRemarkPlugin() {
  /**
   * @param {import('mdast').Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  return (tree) => {
    visit(tree, (node) => {
      if (
        node.type === "containerDirective" ||
        node.type === "leafDirective" ||
        node.type === "textDirective"
      ) {
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



export async function parseMDX(post: { content?: string | null | undefined }) {
  return await compileMDX({
    source: post?.content || "",
    //@ts-ignore
    components: components,
    options: {
      mdxOptions: {
        remarkRehypeOptions: {
          allowDangerousHtml: true,
        },
        rehypePlugins: [
          //@ts-ignore
          [rehypeRaw, { passThrough: nodeTypes }],
          //@ts-ignore
          [rehypeKatex],
        ],
        remarkPlugins: [
          // myRemarkPlugin,
          [
            //@ts-ignore
            remarkShikiTwoslash,
            {
              theme,
              // langs: languages,
            },
          ],
          //@ts-ignore
          remarkGfm,
          //@ts-ignore
          remarkMath,
          remarkDirective,
          myRemarkPlugin,
          //@ts-ignore
        ],
        format: "mdx",
      },
    },
  });
}
