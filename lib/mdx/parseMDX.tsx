import { nodeTypes } from "@mdx-js/mdx";
// import { serialize } from "next-mdx-remote/serialize";
import { compileMDX } from "next-mdx-remote/rsc";
//@ts-ignore
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkShikiTwoslash from "remark-shiki-twoslash";
const theme = require("shiki/themes/nord.json");

import remarkDirective from "remark-directive";
import remarkMath from "remark-math";
import { components } from "./useComponents";
import { myRemarkPlugin } from "./myRemarkPlugin";
import "katex/dist/katex.min.css";

export async function parseMDX(post: { content?: string | null | undefined }) {
  try {
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
  } catch (error) {
    return { content: post.content };
  }
}
