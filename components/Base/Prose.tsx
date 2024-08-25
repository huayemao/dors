import c from "@/styles/prose.module.css";
import LightBox from "../Lightbox";
import { parseMDXClient } from "@/lib/mdx/parseMDXClient";
import { MDXContent } from "mdx/types";

export default function Prose({ content }: { content }) {
  let result: MDXContent | undefined;
  if (typeof content === "string") {
    result = parseMDXClient(content);
  }
  return (
    <>
      <article
        className={
          c.content +
          " " +
          "dark:prose-invert prose lg:prose-xl py-6 overflow-hidden"
        }
      >
        {result?.({}) || content}
      </article>
      <LightBox></LightBox>
    </>
  );
}
