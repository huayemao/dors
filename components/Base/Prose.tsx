import c from "@/styles/prose.module.css";
import LightBox from "../Lightbox";
import ParsedMdx from "./parsedMdx";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { DotIcon, Ellipsis } from "lucide-react";

export default function Prose({
  content,
  preview = false,
}: {
  content;
  preview?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const [html, setHTML] = useState("");

  function update() {
    if (!preview || !ref.current) {
      return;
    }
    const img =
      ref.current.querySelector("img") ||
      ref.current.querySelector("video") ||
      ref.current.querySelector("audio");
    let _html = "";
    if (img) {
      _html += img.outerHTML;
    }

    const div = document.createElement("div");
    div.innerHTML = ref.current.innerHTML;

    const gallery = div.querySelector('[class^="gallery"]');

    if (gallery) {
      gallery.innerHTML = "";
    }
    const children = Array.from(div.children)
      .filter((e) => !!e.textContent)
      .slice(0, 3);
    _html += children.map((e) => e.outerHTML).join("");
    setHTML(_html);
  }

  return (
    <>
      {
        <article
          ref={ref}
          className={cn(
            c.content,
            "dark:prose-invert prose lg:prose-xl py-6 overflow-hidden",
            { hidden: preview && html }
          )}
        >
          {typeof content == "string" ? (
            <ParsedMdx onParse={update} content={content} />
          ) : (
            content
          )}
        </article>
      }
      {html && (
        <article
          className={
            c.content +
            " " +
            "dark:prose-invert prose lg:prose-xl py-6 overflow-hidden"
          }
          dangerouslySetInnerHTML={{ __html: html }}
        ></article>
      )}
      {html && (
        <div className="w-full text-right">
          <Ellipsis className="size-4 inline" strokeWidth={1.2}></Ellipsis>
        </div>
      )}
      <LightBox></LightBox>
    </>
  );
}
