import { compile, evaluate, nodeTypes } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkShikiTwoslash from "remark-shiki-twoslash";
import remarkDirective from "remark-directive";
import remarkMath from "remark-math";
import * as runtime from "react/jsx-runtime";
import { components } from "@/lib/mdx/useComponents";
import { directiveAdapterPlugin } from "./directiveAdapterPlugin";
import { setWasm } from "shiki";
import nord from "shiki/themes/nord.json";
import "katex/dist/katex.min.css";

// declare type Lang =
//   | "abap"
//   | "actionscript-3"
//   | "ada"
//   | "apache"
//   | "apex"
//   | "apl"
//   | "applescript"
//   | "asm"
//   | "astro"
//   | "awk"
//   | "ballerina"
//   | "bat"
//   | "batch"
//   | "berry"
//   | "be"
//   | "bibtex"
//   | "bicep"
//   | "c"
//   | "clojure"
//   | "clj"
//   | "cobol"
//   | "codeql"
//   | "ql"
//   | "coffee"
//   | "cpp"
//   | "crystal"
//   | "csharp"
//   | "c#"
//   | "css"
//   | "cue"
//   | "d"
//   | "dart"
//   | "diff"
//   | "docker"
//   | "dream-maker"
//   | "elixir"
//   | "elm"
//   | "erb"
//   | "erlang"
//   | "fish"
//   | "fsharp"
//   | "f#"
//   | "gherkin"
//   | "git-commit"
//   | "git-rebase"
//   | "gnuplot"
//   | "go"
//   | "graphql"
//   | "groovy"
//   | "hack"
//   | "haml"
//   | "handlebars"
//   | "hbs"
//   | "haskell"
//   | "hcl"
//   | "hlsl"
//   | "html"
//   | "ini"
//   | "java"
//   | "javascript"
//   | "js"
//   | "jinja-html"
//   | "json"
//   | "jsonc"
//   | "jsonnet"
//   | "jssm"
//   | "fsl"
//   | "jsx"
//   | "julia"
//   | "jupyter"
//   | "kotlin"
//   | "latex"
//   | "less"
//   | "lisp"
//   | "logo"
//   | "lua"
//   | "make"
//   | "makefile"
//   | "markdown"
//   | "md"
//   | "marko"
//   | "matlab"
//   | "mdx"
//   | "nginx"
//   | "nim"
//   | "nix"
//   | "objective-c"
//   | "objc"
//   | "objective-cpp"
//   | "ocaml"
//   | "pascal"
//   | "perl"
//   | "php"
//   | "plsql"
//   | "postcss"
//   | "powershell"
//   | "ps"
//   | "ps1"
//   | "prisma"
//   | "prolog"
//   | "pug"
//   | "jade"
//   | "puppet"
//   | "purescript"
//   | "python"
//   | "py"
//   | "r"
//   | "raku"
//   | "perl6"
//   | "razor"
//   | "rel"
//   | "riscv"
//   | "ruby"
//   | "rb"
//   | "rust"
//   | "rs"
//   | "sas"
//   | "sass"
//   | "scala"
//   | "scheme"
//   | "scss"
//   | "shaderlab"
//   | "shader"
//   | "shellscript"
//   | "shell"
//   | "bash"
//   | "sh"
//   | "zsh"
//   | "smalltalk"
//   | "solidity"
//   | "sparql"
//   | "sql"
//   | "ssh-config"
//   | "stata"
//   | "stylus"
//   | "styl"
//   | "svelte"
//   | "swift"
//   | "system-verilog"
//   | "tasl"
//   | "tcl"
//   | "tex"
//   | "toml"
//   | "tsx"
//   | "turtle"
//   | "twig"
//   | "typescript"
//   | "ts"
//   | "vb"
//   | "cmd"
//   | "verilog"
//   | "vhdl"
//   | "viml"
//   | "vim"
//   | "vimscript"
//   | "vue-html"
//   | "vue"
//   | "wasm"
//   | "wenyan"
//   | "文言"
//   | "xml"
//   | "xsl"
//   | "yaml"
//   | "zenscript";

// 支持参数的 cache，key 为 JSON.stringify(args)
function cacheWithArgs<R, Args extends any[]>(fn: (...args: Args) => Promise<R>) {
  const cache = new Map<string, Promise<R>>();
  return async (...args: Args) => {
    const key = JSON.stringify(args[0]); // 只缓存 langs
    if (cache.has(key)) {
      return cache.get(key)!;
    } else {
      const promise = fn(...args);
      cache.set(key, promise);
      return promise;
    }
  };
}

async function loadWasmAndLangs(langs: (string | any)[] = [
  "ts", "js", "jsx", "tsx", "mdx", "md", "json", "html", "css", "powershell", "bash", "java", "c", "cpp", "sql", "vue", "xml", "python", "toml", "yaml"
]) {
  const responseWasm = await fetch("/shiki/onig.wasm");
  const wasmArrayBuffer = await responseWasm.arrayBuffer();
  await setWasm(wasmArrayBuffer);

  const res = remarkShikiTwoslash({
    // @ts-ignore
    theme: nord,
    langs: langs as any,
    paths: {
      languages: "/shiki/languages/",
    },
  });

  const h = () => res;

  return h;
}

const initShiki = cacheWithArgs(loadWasmAndLangs);

// 提取 mdx 代码块中的语言
function extractLangsFromMDX(mdx: string): string[] {
  const regex = /```([\w-]+)/g;
  const langs = new Set<string>();
  let match;
  while ((match = regex.exec(mdx))) {
    langs.add(match[1]);
  }
  return Array.from(langs);
}

export async function parseMDXClient(mdx: string) {
  let shikiTwoSlash: Awaited<ReturnType<typeof initShiki>> | null = null;
  let langs: string[] = [];
  if (mdx?.includes("```")) {
    langs = extractLangsFromMDX(mdx);
    console.log("Extracted langs from MDX:", langs);
    if (langs.length === 0) {
      langs = [
        "ts", "js", "jsx", "tsx", "mdx", "md", "json", "html", "css", "powershell", "bash", "java", "c", "cpp", "sql", "vue", "xml", "python", "toml", "yaml"
      ];
    }
    shikiTwoSlash = await initShiki(langs);
  }

  const remarkPlugins = [
    remarkGfm,
    remarkMath,
    remarkDirective,
    directiveAdapterPlugin,
  ];

  if (shikiTwoSlash) {
    // @ts-ignore
    remarkPlugins.unshift([shikiTwoSlash]);
  }

  // @ts-ignore
  const res = await evaluate(mdx, {
    ...runtime,
    useMDXComponents: () => {
      return components;
    },
    remarkRehypeOptions: {
      allowDangerousHtml: true,
    },
    rehypePlugins: [[rehypeRaw, { passThrough: nodeTypes }], [rehypeKatex]],
    remarkPlugins,
    format: "mdx",
  });

  return res.default;
}
