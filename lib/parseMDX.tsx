import { languages } from "@/lib/shiki";
import { nodeTypes } from "@mdx-js/mdx";
// import { serialize } from "next-mdx-remote/serialize";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkShikiTwoslash from "remark-shiki-twoslash";
const theme = require("shiki/themes/nord.json");

import Carousel from "@/components/Carousel";
import DataList from "@/components/DataList";
import { DigitsHighlightButton } from "@/components/DigitsHighlightButton";
import { PersonList } from "@/components/Person";
import { QuestionList } from "@/components/Question";
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
  DataList:(props) => <DataList {...props} />,
  ToolBox:(props) => <ToolBox {...props} />,
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
