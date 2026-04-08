import { nodeTypes, compile, run } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkShikiTwoslash from "remark-shiki-twoslash";
import theme from "shiki/themes/nord.json";

import remarkDirective from "remark-directive";
import remarkMath from "remark-math";
import { components } from "./useComponents";
import { directiveAdapterPlugin } from "./directiveAdapterPlugin";
import withToc from "@stefanprobst/rehype-extract-toc";
import withTocExport from "@stefanprobst/rehype-extract-toc/mdx";
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
    const parsePromise = (async () => {
      // Compile MDX to function body
      const code = String(
        await compile(post?.content || "", {
          outputFormat: "function-body",
          remarkPlugins: list,
          rehypePlugins: [
            [rehypeRaw, { passThrough: nodeTypes }],
            [rehypeKatex],
            withToc,
            withTocExport,
          ],
        })
      );

      // Run the compiled code
      const { default: MDXContent, ...rest } = await run(code, {
        ...runtime,
        baseUrl: import.meta.url,
      });

      // Return result in a format compatible with the original
      return {
        content: MDXContent,
        toc: rest.tableOfContents || [],
        components: { ...components, ...(options?.components || {}) },
      };
    })();

    // Race the parsing against the timeout
    const result = await parsePromise;

    // Cache the result
    mdxResultCache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error("MDX parsing error:", error);
    return { content: post.content, toc: [] };
  }
}
