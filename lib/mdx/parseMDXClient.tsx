import { compile, evaluate, nodeTypes } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkShikiTwoslash from "remark-shiki-twoslash";
import remarkDirective from "remark-directive";
import remarkMath from "remark-math";
import * as runtime from "react/jsx-runtime";
import { components } from "@/lib/mdx/useComponents";
import { myRemarkPlugin } from "./myRemarkPlugin";
import { BUNDLED_LANGUAGES, setCDN, setWasm } from 'shiki'


export async function parseMDXClient(mdx: string) {
  setCDN('https://unpkg.com/shiki@0.10.1/');
  const responseWasm = await fetch("https://unpkg.com/shiki/dist/onig.wasm");
  const wasmArrayBuffer = await responseWasm.arrayBuffer();
  setWasm(wasmArrayBuffer);

  // @ts-ignore
  const res = await evaluate(mdx, {
    ...runtime,
    useMDXComponents: () => {
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
      [
        remarkShikiTwoslash
        , { theme: 'nord', languages: ['typescript'] }
      ],
      remarkGfm,
      remarkMath,
      remarkDirective,
      myRemarkPlugin,
    ],
    format: 'mdx',

  });
  console.log(res.default)

  return res.default
}
