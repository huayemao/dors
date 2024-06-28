import { languages } from "@/lib/shiki";
import { nodeTypes } from "@mdx-js/mdx";
// import { serialize } from "next-mdx-remote/serialize";
import { compileMDX } from "next-mdx-remote/rsc";
//@ts-ignore
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkShikiTwoslash from "remark-shiki-twoslash";
const theme = require("shiki/themes/nord.json");

import Annotate from "@/components/Annotate";
import Carousel from "@/components/Carousel";
import Columns from "@/components/Columns";
import DataList from "@/components/DataList";
import { DigitsHighlightButton } from "@/components/DigitsHighlightButton";
import { PersonList } from "@/components/Person";
import { Pre } from "@/components/Pre";
import { QuestionList } from "@/components/Question";
import Raw from "@/components/Raw";
import Tag from "@/components/Tag";
import ToolBox from "@/components/ToolBox";
import Word from "@/components/Word";
import nextConfig from "@/next.config.mjs";
import Image from "next/image";
import remarkMath from "remark-math";

const components = {
  Tag: (props) => <Tag type="primary" text={props.children}></Tag>,
  QuestionList: (props) => <QuestionList {...props} />,
  Columns: (props) => <Columns {...props} />,
  PersonList: (props) => <PersonList {...props} />,
  Word: (props) => <Word {...props} />,
  Carousel: (props) => <Carousel {...props} />,
  DigitsHighlightButton: (props) => <DigitsHighlightButton {...props} />,
  DataList: (props) => <DataList {...props} />,
  ToolBox: (props) => <ToolBox {...props} />,
  Annotate: (props) => <Annotate {...props}></Annotate>,
  Note: (props) => (
    <Annotate {...props} source={props.children}>
      {props.description}
    </Annotate>
  ),
  Raw: (props) => <Raw {...props}></Raw>,
  h1: (props) => <h1 id={encodeURIComponent(props.children)} {...props}></h1>,
  h2: (props) => <h2 id={encodeURIComponent(props.children)} {...props}></h2>,
  h3: (props) => <h3 id={encodeURIComponent(props.children)} {...props}></h3>,
  h4: (props) => <h4 id={encodeURIComponent(props.children)} {...props}></h4>,
  h5: (props) => <h5 id={encodeURIComponent(props.children)} {...props}></h5>,
  pre: Pre,
  img: async (props) => {
    return (
      <a href={props.src} data-pswp-width="800" data-pswp-height="600">
        <figure suppressHydrationWarning>
          <Image
            unoptimized={nextConfig.output === "export"}
            sizes="100vw"
            style={{ width: "100%", height: "auto" }}
            width={800}
            height={600}
            referrerPolicy="origin"
            {...props}
          />{" "}
          <figcaption>{props.alt}</figcaption>
        </figure>
      </a>
    );
  },
};

export async function parseMDX(post: { content?: string | null | undefined }) {
  return await compileMDX({
    source: post?.content || "",
    //@ts-ignore
    components,
    options: {
      mdxOptions: {
        remarkRehypeOptions: {
          allowDangerousHtml: true,
        },
        rehypePlugins: [
          [rehypeRaw, { passThrough: nodeTypes }],
          //@ts-ignore
          [rehypeKatex],
        ],
        remarkPlugins: [
          [
            remarkShikiTwoslash,
            {
              theme,
              langs: languages,
            },
          ],
          remarkGfm,
          remarkMath,
        ],
        format: "mdx",
      },
    },
  });
}
