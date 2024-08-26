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
import { setWasm } from "shiki";
import nord from "shiki/themes/nord.json";

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

export async function parseMDXClient(mdx: string) {
  const responseWasm = await fetch("/shiki/onig.wasm");
  const wasmArrayBuffer = await responseWasm.arrayBuffer();
  await setWasm(wasmArrayBuffer);

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
    remarkPlugins: [
      [
        remarkShikiTwoslash,
        {
          theme: nord,
          langs: [
            "ts",
            "js",
            "jsx",
            "tsx",
            "json",
            "html",
            "css",
            "powershell",
            "bash",
            "java",
            "c",
            "cpp",
            "sql",
            "vue",
          ],
          paths: {
            languages: "/shiki/languages/",
          },
        },
      ],
      remarkGfm,
      remarkMath,
      remarkDirective,
      myRemarkPlugin,
    ],
    format: "mdx",
  });
  console.log(res.default);

  return res.default;
}
