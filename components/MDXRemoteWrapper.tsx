"use client";

import { MDXRemote, MDXRemoteProps } from "next-mdx-remote";
import { QuestionList } from "./Question";
import Tag from "./Tag";

const components = {
  Tag: (props) => <Tag type="primary" text={props.children}></Tag>,
  QuestionList: (props) => <QuestionList {...props} />,
};

export default function MDXRemoteWrapper(props: MDXRemoteProps) {
  return (
    <MDXRemote
      {...props}
      components={{ ...(props.components || {}), ...components }}
    />
  );
}
