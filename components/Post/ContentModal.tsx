"use client";
import { getCurrentSegmentContent } from "@/lib/utils";
import { Dialog } from "@headlessui/react";
import { BaseButtonIcon } from "@shuriken-ui/react";
import { EyeIcon } from "lucide-react";
import { useCallback, useEffect, useReducer, useState } from "react";
import { createPortal } from "react-dom";

export default function Wrapper(){
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 200); // 延迟 1 秒
  }, []);

  return mounted ? (
    <ContentModal></ContentModal>
  ) : null;
}

function ContentModal() {
  const [, forceUpdate] = useReducer((bool) => !bool, false);
  const [content, setContent] = useState("");

  const detail = !!new URLSearchParams(location.search).get("detail");

  useEffect(() => {
    window.addEventListener("popstate", (e) => {
      forceUpdate();
    });
  }, []);

  const getArticle = useCallback(() => {
    return document.querySelector("article.prose") as HTMLElement;
  }, [window.location.pathname]);

  const list = useCallback(() => {
    const article = document.querySelector("article.prose") as HTMLElement;
    return Array.from(article.querySelectorAll("h1, h2, h3, h4, h5"));
  }, [window.location.pathname]);

  useEffect(() => {
    const article = getArticle();
    if (detail) {
      const target = list().find(
        (e) => e.textContent == decodeURIComponent(location.hash).slice(1)
      );
      if (target!.tagName) {
        const res = getCurrentSegmentContent(target as HTMLElement);
        article.classList.add("hidden");
        setContent(res);
      }
    } else {
      article.classList.remove("hidden");
    }
  }, [location.search]);

  const headings = list();

  useEffect(() => {
    list().forEach((e) => {
      (e as HTMLElement).classList.add("group");
    });
  }, []);

  return (
    <>
      {headings.map((e) => {
        const url = new URL(location.href);
        url.search = "?detail=true";
        url.hash = e.textContent!;
        return createPortal(
          <BaseButtonIcon
            className="hidden !h-6 !w-6 group-hover:inline-flex !ms-1"
            // color="light"
            size="sm"
            rounded="full"
            onClick={() => {
              window.history.pushState(null, "", url.href);
              forceUpdate();
            }}
          >
            <EyeIcon className="w-4 h-4"></EyeIcon>
          </BaseButtonIcon>,
          e
        );
      })}
      <Dialog
        className="inset-0 fixed bg-white w-full h-[100vh] z-50"
        open={!!detail}
        onClose={() => {
          history.back();
        }}
      >
        <div
          contentEditable
          className="prose lg:prose-xl prose-code:bg-primary-100 prose-code:text-primary-500 prose-code:font-medium w-full h-full max-w-full"
          style={{
            columns: "2 auto",
            columnRule: "1px solid #e5e7eb",
            columnGap: "2rem",
          }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </Dialog>
    </>
  );
}
