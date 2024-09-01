import c from "@/styles/prose.module.css";
import LightBox from "../Lightbox";
import ParsedMdx from "./parsedMdx";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export default Prose;

function Prose({ content, preview = false }: { content; preview?: boolean }) {
  return (
    <>
      {typeof content == "string" ? (
        <ParsedMdx preview={preview} content={content} />
      ) : (
        <article
          className={cn(
            c.content,
            "dark:prose-invert prose lg:prose-xl py-6 overflow-hidden"
          )}
        >
          {content}
        </article>
      )}

      <LightBox></LightBox>
    </>
  );
}
