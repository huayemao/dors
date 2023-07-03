import { languages } from "@/lib/shiki";
import { nodeTypes } from "@mdx-js/mdx";
import { serialize } from "next-mdx-remote/serialize";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkShikiTwoslash from "remark-shiki-twoslash";
const theme = require("shiki/themes/nord.json");

export async function parseMDX(post: {
  content?: string | null | undefined;
}) {
  return await serialize(post?.content || "", {
    mdxOptions: {
      rehypePlugins: [[rehypeRaw, { passThrough: nodeTypes }]],
      remarkPlugins: [
        [
          remarkShikiTwoslash,
          {
            theme,
            langs: languages,
          },
        ],
        remarkGfm,
      ],
      format: "mdx",
    },
  });
}
