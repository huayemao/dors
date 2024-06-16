"use client";
import { getCurrentSegmentContent } from "@/lib/utils";
import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";
export default function ContentModal() {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");

  function handler(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (target!.tagName) {
      const res = getCurrentSegmentContent(target as HTMLElement);
      const article = document.querySelector("article.prose") as HTMLElement;
      article.classList.add("hidden");
      setContent(res);
    }
    setOpen(true);
  }
  useEffect(() => {
    const article = document.querySelector("article.prose") as HTMLElement;
    article.addEventListener("dblclick", handler);
    return () => {
      article.removeEventListener("dblclick", handler);
    };
  }, []);

  return (
    <Dialog
      className="inset-0 fixed bg-white w-full h-[100vh] z-50"
      open={open}
      onClose={() => {
        const article = document.querySelector("article.prose") as HTMLElement;
        article.classList.remove("hidden");
        setOpen(false);
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
  );
}
