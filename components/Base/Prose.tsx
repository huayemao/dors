import c from "@/styles/prose.module.css";
import LightBox from "../Lightbox";

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
        {content}
      </article>
      <LightBox></LightBox>
    </>
  );
}
