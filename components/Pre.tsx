"use client";
import { cn } from "@/lib/utils";
import c from '@/styles/Pre.module.css';
import type { ComponentProps, ReactElement } from "react";
import React, { useRef } from "react";
import { CopyToClipboard } from "./copy-to-clipboard";

export const Pre = ({
  children,
  className,
  ...props
}: ComponentProps<"pre">): ReactElement<any> => {
  const preRef = useRef<HTMLPreElement | null>(null);
  const arr = React.Children.toArray(children) as ReactElement<any>[];
  const lidEl = arr.filter((e) => e.props.className.includes("language-id"));
  const containerEl = arr.filter((e) =>
    e.props.className.includes("code-container")
  );
  return (
    <pre {...props} ref={preRef} className={cn("relative !pt-10 !overflow-x-hidden",c.shiki)}>
      <div className="absolute top-0 right-0 left-0 flex items-center justify-between w-full px-6 py-2 pr-4 bg-muted-700 text-muted-100">
        <span className="text-xs lowercase">
          {lidEl ?? (lidEl as ReactElement<any>).props.children}
        </span>
        <div className="flex items-center space-x-1">
          {
            <CopyToClipboard
              getValue={() =>
                preRef.current?.querySelector("code")?.innerText || ""
              }
            />
          }
        </div>
      </div>
      {containerEl}
    </pre>
  );
};
