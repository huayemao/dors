"use client";
import { parseMDXClient } from "@/lib/mdx/parseMDXClient";
import { BaseButton, BasePlaceload } from "@shuriken-ui/react";
import { MDXContent } from "mdx/types";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import c from "@/styles/prose.module.css";
import { cn } from "@/lib/utils";
import { ArrowRight, ChevronRight, Ellipsis } from "lucide-react";
import withClientOnly from "@/lib/client/utils/withClientOnly";
import LightBox from "./LightBox";
import { useMediaQuery } from "@uidotdev/usehooks";

const parsedMdx = withClientOnly(Content);

export default parsedMdx;
function Content({
  content,
  preview = false,
  className
}: {
  content: string;
  preview?: boolean;
  className?: string;
}) {
  const [result, setRes] = useState<MDXContent>();
  const [loading, setLoading] = useState(true);
  const [html, setHTML] = useState("");
  const ref = useRef<HTMLElement>(null);
  const isMobile = useMediaQuery("only screen and (max-width : 720px)");

  useLayoutEffect(() => {
    if (!loading) {
      setLoading(true);
    }
    parseMDXClient(content)
      .then(setRes)
      .finally(() => {
        setTimeout(() => {
          update();
        }, 1);
        setLoading(false);
      });
  }, [content, preview]);


  function update() {
    if (!preview || !ref.current) {
      return;
    }

    let _html = "";

    const div = document.createElement("div");
    div.innerHTML = ref.current.innerHTML;
    if (!div.textContent) {
      return
    }

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
            className,
            { hidden: preview || loading }
          )}
        >
          {typeof result == "function" ? (
            result({})
          )

            : (
              <>{result}
              </>
            )}
        </article>
      )}
      {loading &&
        <div className="space-y-2 py-6 ">
          <BasePlaceload className="h-4 w-full rounded" />
          <BasePlaceload className="h-4 w-3/4 rounded" />
          <BasePlaceload className="h-4 w-full rounded" />
        </div>
      }
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
              <BaseButton
                color="dark"
                size={isMobile ? "sm" : "md"}
                variant="pastel"
              >
                详情
                <ArrowRight className="size-4 inline ms-2"></ArrowRight>
              </BaseButton>
            </div>
          )}
        </>
      )}
      <LightBox gallery={preview ? "div.prose" : ref.current!} />
    </>
  );
}
