import { compile, evaluateSync, nodeTypes } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkShikiTwoslash from "remark-shiki-twoslash";
import remarkDirective from "remark-directive";
import remarkMath from "remark-math";
import * as runtime from "react/jsx-runtime";

import { components } from "@/lib/mdx/useComponents";
import { myRemarkPlugin } from "./myRemarkPlugin";


export  function parseMDXClient(mdx: string) {
  // @ts-ignore
  const res = evaluateSync(mdx, {
    ...runtime,
    useMDXComponents: () => {
      // @ts-ignore
      delete components['pre']
      return components;
    },
    remarkRehypeOptions: {
      allowDangerousHtml: true,
    },
    rehypePlugins: [
      [rehypeRaw, { passThrough: nodeTypes }],
      [rehypeKatex],
    ],
    remarkPlugins: [
      // [
      //   remarkShikiTwoslash
      //   , { theme: 'nord' }
      // ],
      remarkGfm,
      remarkMath,
      remarkDirective,
      myRemarkPlugin,
    ],
    format: 'mdx',

  });

  return res.default
}
