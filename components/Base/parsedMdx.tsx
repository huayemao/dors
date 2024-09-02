"use client";
import { parseMDXClient } from "@/lib/mdx/parseMDXClient";
import { BasePlaceload } from "@shuriken-ui/react";
import { MDXContent } from "mdx/types";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import c from "@/styles/prose.module.css";
import { cn } from "@/lib/utils";
import { Ellipsis } from "lucide-react";
import withClientOnly from "@/lib/client/utils/withClientOnly";
import LightBox from "./LightBox";

const parsedMdx = withClientOnly(Content);

export default parsedMdx;
function Content({
  content,
  preview = false,
}: {
  content: string;
  preview?: boolean;
}) {
  const [result, setRes] = useState<MDXContent>();
  const [loading, setLoading] = useState(true);
  const [html, setHTML] = useState("");
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    parseMDXClient(content)
      .then(setRes)
      .finally(() => {
        setLoading(false);
      });
  }, [content]);

  useLayoutEffect(() => {
    update();
  }, [result]);

  function update() {
    if (!preview || !ref.current) {
      return;
    }

    let _html = "";

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

    const img =
      ref.current.querySelector("img") ||
      ref.current.querySelector("video") ||
      ref.current.querySelector("audio");
    if (img && !_html.includes(img.outerHTML)) {
      _html = img.outerHTML + _html;
    }
    setHTML(_html);
  }

  return (
    <>
      {!html && (
        <article
          ref={ref}
          className={cn(
            c.content,
            "dark:prose-invert prose lg:prose-xl py-6 overflow-hidden",
            { hidden: preview && html }
          )}
        >
          {typeof result == "function" ? (
            result({})
          ) : !loading ? (
            result
          ) : (
            <div className="space-y-2">
              <BasePlaceload className="h-4 w-full rounded" />
              <BasePlaceload className="h-4 w-3/4 rounded" />
              <BasePlaceload className="h-4 w-full rounded" />
            </div>
          )}
        </article>
      )}
      {preview && (
        <>
          {html && (
            <div
              className={cn(
                c.content,
                "dark:prose-invert prose lg:prose-xl py-6 overflow-hidden"
              )}
              dangerouslySetInnerHTML={{ __html: html }}
            ></div>
          )}
          {html && (
            <div className="w-full text-right">
              <Ellipsis className="size-4 inline" strokeWidth={1.2}></Ellipsis>
            </div>
          )}
        </>
      )}
      <LightBox gallery={preview ? "div.prose" : ref.current!} />
    </>
  );
}
