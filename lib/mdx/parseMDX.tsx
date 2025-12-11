import { nodeTypes } from "@mdx-js/mdx";
// import { serialize } from "next-mdx-remote/serialize";
import { compileMDX } from "next-mdx-remote/rsc";
//@ts-ignore
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkShikiTwoslash from "remark-shiki-twoslash";
import theme from "shiki/themes/nord.json";

import remarkDirective from "remark-directive";
import remarkMath from "remark-math";
import { components } from "./useComponents";
import { directiveAdapterPlugin } from "./directiveAdapterPlugin";
import "katex/dist/katex.min.css";
import { cache } from "react";
import { PluggableList } from "unified";

// Cache for MDX parsing results
const mdxResultCache = new Map<string, any>();

// Timeout for MDX parsing (in milliseconds)
const MDX_TIMEOUT = 10000; // 10 seconds

export default cache(parseMDX);

async function parseMDX(
  post: { content?: string | null | undefined },
  options?: { components: {} }
) {
  try {
    // Generate a cache key based on content
    const cacheKey = post?.content || "";

    // Check if we have a cached result
    if (mdxResultCache.has(cacheKey)) {
      return mdxResultCache.get(cacheKey);
    }

    // Create a promise that will reject after the timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("MDX parsing timed out"));
      }, MDX_TIMEOUT);
    });

    const list: PluggableList = [
      // myRemarkPlugin,

      //@ts-ignore
      remarkGfm,
      //@ts-ignore
      remarkMath,
      remarkDirective,
      directiveAdapterPlugin,
    ];

    if (post.content?.includes(":::")) {
      list.unshift(remarkDirective);
      list.unshift(directiveAdapterPlugin);
    }

    if (post.content?.includes("```")) {
      list.unshift([
        remarkShikiTwoslash,
        {
          theme,
          // langs: languages,
        },
      ]);
    }
    // Create the actual MDX parsing promise
    const parsePromise = compileMDX({
      source: post?.content || "",
      components: { ...components, ...(options?.components || {}) },

      options: {
        mdxOptions: {
          jsxImportSource: "react", // 强制使用项目的 React
          // 显式指定 JSX 运行时路径（适配 Next.js 15）
          remarkRehypeOptions: {
            allowDangerousHtml: true,
          },
          rehypePlugins: [
            [rehypeRaw, { passThrough: nodeTypes }],
            [rehypeKatex],
          ],
          remarkPlugins: list,
          format: "mdx",
        },
      },
    });

    // Race the parsing against the timeout
    const result = await Promise.race([parsePromise, timeoutPromise]);

    // Cache the result
    mdxResultCache.set(cacheKey, result);

    return result;
  } catch (error) {
    console.error("MDX parsing error:", error);
    return { content: post.content };
  }
}
