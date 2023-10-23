import { languages } from "@/lib/shiki";
import { nodeTypes } from "@mdx-js/mdx";
// import { serialize } from "next-mdx-remote/serialize";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkShikiTwoslash from "remark-shiki-twoslash";
const theme = require("shiki/themes/nord.json");

import Annotate from "@/components/Annotate";
import Carousel from "@/components/Carousel";
import DataList from "@/components/DataList";
import { DigitsHighlightButton } from "@/components/DigitsHighlightButton";
import { PersonList } from "@/components/Person";
import { QuestionList } from "@/components/Question";
import Raw from "@/components/Raw";
import Tag from "@/components/Tag";
import ToolBox from "@/components/ToolBox";
import Word from "@/components/Word";
import { MDXRemote, MDXRemoteProps } from "next-mdx-remote";

const components = {
  Tag: (props) => <Tag type="primary" text={props.children}></Tag>,
  QuestionList: (props) => <QuestionList {...props} />,
  PersonList: (props) => <PersonList {...props} />,
  Word: (props) => <Word {...props} />,
  Carousel: (props) => <Carousel {...props} />,
  DigitsHighlightButton: (props) => <DigitsHighlightButton {...props} />,
  DataList: (props) => <DataList {...props} />,
  ToolBox: (props) => <ToolBox {...props} />,
  Annotate: (props) => <Annotate {...props}></Annotate>,
  Raw:(props)=><Raw {...props}></Raw>,
  h1:(props)=><h1 id={props.children} {...props}></h1>,
  h2:(props)=><h2 id={props.children} {...props}></h2>,
  h3:(props)=><h3 id={props.children} {...props}></h3>,
  h4:(props)=><h4 id={props.children} {...props}></h4>,
};

export default function MDXRemoteWrapper(props: MDXRemoteProps) {
  return (
    <MDXRemote
      {...props}
      components={{ ...(props.components || {}), ...components }}
    />
  );
}

export async function parseMDX(post: { content?: string | null | undefined }) {
  return await compileMDX({
    source: post?.content || "",
    components,
    options: {
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
    },
  });
}
