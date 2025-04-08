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
import Gallery from "../Gallery";
import { filterEmptyLines } from "@/lib/mdx/filterEmptyLines";

const parsedMdx = withClientOnly(Content);

export default parsedMdx;
function Content({
  content,
  preview = false,
  className,
  onLoadingChange,
}: {
  content: string;
  preview?: boolean;
  className?: string;
  onLoadingChange?: (loading: boolean) => void;
}) {
  const [result, setRes] = useState<MDXContent>();
  const [loading, setLoading] = useState(true);
  const ref = useRef<HTMLElement>(null);
  const isMobile = useMediaQuery("only screen and (max-width : 768px)");

  useEffect(() => {
    onLoadingChange?.(true);
    parseMDXClient(content)
      .then((res) => {
        // 这里的 type 是 function
        // console.log(typeof res);
        setRes(res);
      })
      .finally(() => {
        setLoading(false);
        onLoadingChange?.(false);
      });
  }, [content, onLoadingChange]);

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
          : isValidElement(result) && preview
            ? extractPreview(result)
            : result}
      </article>
      {loading && (
        <div className="space-y-2 py-6 ">
          <BasePlaceload className="h-4 w-full rounded" />
          <BasePlaceload className="h-4 w-3/4 rounded" />
          <BasePlaceload className="h-4 w-full rounded" />
        </div>
      )}
      {!preview && <LightBox gallery={ref.current!} />}
    </>
  );

  function extractPreview(result: ReactElement): React.ReactNode {
    // console.log(result);
    if (result.type.toString() == React.Fragment.toString()) {
      const children = React.Children.toArray(result.props.children);
      return children.slice(0, 3);
    }

    const isGallery = result.type.toString() == Gallery.toString();
    if (isGallery) {
      const { children: galleryChildren, ...props } = result.props;
      const p = React.Children.toArray(galleryChildren)[0] as ReactElement;
      const c = React.Children.toArray(p.props.children);
      const changedChildren = filterEmptyLines(c);
      const threshold = isMobile ? 4 : 9;
      const id = "g" + Date.now().toString();

      return (
        <>
          <Gallery
            id={id}
            preview={true}
            className="grid grid-cols-2 md:grid-cols-3"
          >
            {changedChildren.map((e: ReactElement, i) => ({
              ...e,
              props: { ...e.props, preview: true, className: cn({ 'hidden': i >= threshold }) },
            }))}
          </Gallery>
          <LightBox gallery={"#" + id}></LightBox>
        </>
      );
    }
    return result;
  }
}
