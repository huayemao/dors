"use client";
import { parseMDXClient } from "@/lib/mdx/parseMDXClient";
import { BaseButton, BasePlaceload } from "@shuriken-ui/react";
import { MDXContent } from "mdx/types";
import {
  isValidElement,
  ReactElement,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import c from "@/styles/prose.module.css";
import { cn, getDateStr } from "@/lib/utils";
import { ArrowRight, ChevronRight, Ellipsis } from "lucide-react";
import withClientOnly from "@/lib/client/utils/withClientOnly";
import LightBox from "./LightBox";
import { useMediaQuery } from "@uidotdev/usehooks";
import React from "react";

const parsedMdx = withClientOnly(Content);

export default parsedMdx;
function Content({
  content,
  preview = false,
  className,
}: {
  content: string;
  preview?: boolean;
  className?: string;
}) {
  const [result, setRes] = useState<MDXContent>();
  const [loading, setLoading] = useState(true);
  const ref = useRef<HTMLElement>(null);
  const isMobile = useMediaQuery("only screen and (max-width : 720px)");

  useEffect(() => {
    setLoading(true);
    parseMDXClient(content)
      .then((res) => {
        // 这里的 type 是 function
        console.log(typeof res);
        setRes(res);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [content]);

  // function update() {
  //   if (!preview || !ref.current) {
  //     return;
  //   }

  //   let _html = "";

  //   const div = document.createElement("div");
  //   div.innerHTML = ref.current.innerHTML;
  //   if (!div.textContent) {
  //     return;
  //   }

  //   const gallery = div.querySelector('[class^="gallery"]');

  //   if (gallery) {
  //     gallery.innerHTML = "";
  //   }
  //   const children = Array.from(div.children)
  //     .filter((e) => !!e.textContent)
  //     .slice(0, 3);
  //   _html += children.map((e) => e.outerHTML).join("");

  //   const img =
  //     ref.current.querySelector("img") ||
  //     ref.current.querySelector("video") ||
  //     ref.current.querySelector("audio");
  //   if (img && !_html.includes(img.outerHTML)) {
  //     _html = img.outerHTML + _html;
  //   }
  //   setHTML(_html);
  // }

  // 这里的 type 是 object
  // if (isValidElement(result)) {
  //   console.log(
  //     isValidElement(result),
  //     // @ts-ignore
  //     (result as ReactElement).type.toString() == React.Fragment.toString(),
  //     // @ts-ignore
  //     (result as ReactElement).type.toString()
  //   );
  // }

  return (
    <>
      <article
        ref={ref}
        className={cn(
          c.content,
          "dark:prose-invert prose lg:prose-xl py-6 overflow-hidden",
          className,
          { hidden: loading }
        )}
      >
        {typeof result == "function"
          ? React.Children.toArray(result({}).props.children[0]).slice(
              0,
              preview ? 3 : undefined
            )
          : isValidElement(result) &&
            (result as ReactElement).type.toString() ==
              React.Fragment.toString()
          ? React.Children.toArray((result as any).props.children).slice(
              0,
              preview ? 3 : undefined
            )
          : result}
      </article>
      {loading && (
        <div className="space-y-2 py-6 ">
          <BasePlaceload className="h-4 w-full rounded" />
          <BasePlaceload className="h-4 w-3/4 rounded" />
          <BasePlaceload className="h-4 w-full rounded" />
        </div>
      )}
      <LightBox gallery={preview ? "div.prose" : ref.current!} />
    </>
  );
}
