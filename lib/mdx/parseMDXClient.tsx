"use client";
import { evaluateSync } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import * as runtime from "react/jsx-runtime";

import { components } from "@/lib/mdx/useComponents";

export function parseMDXClient(mdx: string) {
  return evaluateSync(mdx, {
    ...(runtime as any),
    remarkPlugins: [remarkGfm],
    useMDXComponents: () => {
      return components;
    },
  }).default;
}
