import c from "@/styles/prose.module.css";
import LightBox from "../Lightbox";

import ParsedMdx from "./parsedMdx";

export default function Prose({ content }: { content }) {
  return (
    <>
      <article
        className={
          c.content +
          " " +
          "dark:prose-invert prose lg:prose-xl py-6 overflow-hidden"
        }
      >
        {typeof content == 'string' ? <ParsedMdx content={content} /> : content}
      </article>
      <LightBox></LightBox>
    </>
  );
}
