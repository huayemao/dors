"use client";

import { useFirstVisibleElement } from "@/lib/client/hooks/firstVisibleElement";
import { cn } from "@/lib/utils";
import React, { useState } from "react";

export type Toc = {
  id: string;
  text: string;
  sub?: boolean;
};

export default function TOC() {
  const [currentViewedTocItem, setCurrentViewedTocItem] = useState("");

  const observedElements = React.useCallback(() => {
    const mainElement = document.querySelector("article");

    if (!mainElement) {
      return [];
    }

    // 看看有没有其他 h2 等
    const elements = mainElement.querySelectorAll(
      "h1, h1 ~ *:not(section), h2:not(.document-toc-heading), h2:not(.document-toc-heading) ~ *:not(section), h3, h3 ~ *:not(section)"
    );
    return Array.from(elements);
  }, [window.location.pathname]);

  // const referencedIds = toc.map(({ id }) => id);
  const idByObservedElement = React.useRef(new Map<Element, string>());

  React.useEffect(() => {
    observedElements().reduce((currentId, observedElement) => {
      const observedId = observedElement.id;
      // if (observedId && referencedIds.includes(observedId)) {
      //   currentId = observedId;
      // }
      if (observedElement.tagName.toLowerCase().match(/^h\d$/)) {
        currentId = observedId;
      }

      idByObservedElement.current.set(observedElement, currentId);

      return currentId;
    }, "");
  }, [observedElements]);

  useFirstVisibleElement(observedElements, (element: Element | null) => {
    const id = element ? idByObservedElement.current.get(element) ?? "" : "";
    if (id !== currentViewedTocItem) {
      setCurrentViewedTocItem(id);
    }
  });

  const headings = observedElements().filter((e) =>
    e.tagName.toLowerCase().match(/^h\d$/)
  );

  return (
    <section className="my-6">
      <ul
        key={window.location.pathname}
        className="max-h-[65vh] md:max-h-[calc(100vh_-_168px)] overflow-y-auto"
        style={{ scrollbarWidth: "thin" }}
      >
        {headings.map((item) => {
          const id = item.id;
          return (
            <TOCItem
              key={id}
              id={id}
              text={item.textContent as string}
              level={parseInt(item.tagName.slice(1))}
              // sub={item.sub}
              currentViewedTocItem={currentViewedTocItem}
            />
          );
        })}
      </ul>
    </section>
  );
}

function TOCItem({
  id,
  text,
  currentViewedTocItem,
  level,
}: Toc & { currentViewedTocItem: string; level: number }) {
  const href = `#${id}`;
  const isActive = currentViewedTocItem === id;

  // todoL 这里并没有做成 tree
  return (
    <li
      className={cn(
        "border-l-2 rounded-sm",
        "border-slate-200 dark:border-slate-700",
        {
          "bg-primary-100/60 border-primary-500 dark:bg-primary-400/10 dark:border-primary-400": isActive,
        }
      )}
    >
      <a
        style={{ textIndent: (level - 2) + "em" }}
        className={cn(
          "w-full py-1 px-4 inline-block text-slate-900 dark:text-slate-200",
          {
            "text-primary-900 dark:text-slate-50 font-semibold": isActive,
          }
        )}
        aria-current={isActive || undefined}
        href={href}
        dangerouslySetInnerHTML={{ __html: text }}
      />
    </li>
  );
}
