"use client";

import { useEffect } from "react";

const Content = ({ html }: { html: string }) => {
  // todo: 用 jsdom
  const parser = new DOMParser();
  const dom = parser.parseFromString(html, "text/html");
  const el = dom.querySelector(".content");
  el?.querySelectorAll("img").forEach((e) => {
    e.style.width = "100%";
  });

  useEffect(() => {
    document.querySelectorAll("img").forEach((e) => {
      e.onerror = (_) => {
        console.log(_);
        if (!e.src.includes("/api/files")) {
          e.src = "/api/files?href=" + e.src;
        }
      };
    });
  }, []);

  return (
    <div
      className="prose lg:prose-lg xl:prose-xl"
      dangerouslySetInnerHTML={{ __html: el?.outerHTML || "" }}
    ></div>
  );
};

export default Content;
