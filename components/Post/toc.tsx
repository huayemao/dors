"use client";

import { useTocObserver } from "@/lib/client/hooks/useTocObserver";
import { cn } from "@/lib/utils";
import React, { Fragment } from "react";
import type { Toc, TocEntry } from '@stefanprobst/rehype-extract-toc';

type TOCProps = {
  toc: Toc;
};

export default function TOC({ toc }: TOCProps) {
  const currentViewedTocItem = useTocObserver(toc);

  // 递归渲染 TOC 项目
  const renderTocItems = React.useCallback((items: TocEntry[], parentLevel: number = 0) => {
    return items.map((item, i) => {
      const { id, value, depth, children } = item;

      return (
        <Fragment key={id}>
          <TOCItem
            id={id || value + i}
            text={value}
            level={depth}
            currentViewedTocItem={currentViewedTocItem}
          />
          {children && children.length > 0 && (
            <ul className="">
              {renderTocItems(children, depth)}
            </ul>
          )}
        </Fragment>
      );
    });
  }, [currentViewedTocItem]);

  return (
      <ul
        className="max-h-[65vh] md:max-h-[calc(100vh_-_168px)] overflow-y-auto"
        style={{ scrollbarWidth: "thin" }}
      >
        {renderTocItems(toc)}
      </ul>
  );
}

const TOCItem = React.memo(function TOCItem({
  id,
  text,
  currentViewedTocItem,
  level,
}: { id: string; text: string; currentViewedTocItem: string; level: number }) {
  const href = `#${id}`;
  const isActive = currentViewedTocItem === id;

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
});
