"use client";

import { MDXRemote, MDXRemoteProps } from "next-mdx-remote";
import Carousel from "./Carousel";
import { PersonList } from "./Person";
import { QuestionList } from "./Question";
import Tag from "./Tag";
import Word from "./Word";

const components = {
  Tag: (props) => <Tag type="primary" text={props.children}></Tag>,
  QuestionList: (props) => <QuestionList {...props} />,
  PersonList: (props) => <PersonList {...props} />,
  Word: (props) => <Word {...props} />,
  Carousel: (props) => <Carousel {...props} />,
};

export default function MDXRemoteWrapper(props: MDXRemoteProps) {
  return (
    <MDXRemote
      {...props}
      components={{ ...(props.components || {}), ...components }}
    />
  );
}
