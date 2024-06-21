"use client";
import type { ComponentProps, ReactElement } from "react";
import React, { useRef } from "react";
import { CopyToClipboard } from "./copy-to-clipboard";

export const Pre = ({
  children,
  className,
  ...props
}: ComponentProps<"pre">): ReactElement => {
  const preRef = useRef<HTMLPreElement | null>(null);
  const arr = React.Children.toArray(children);
  const lidEl = arr[0] as ReactElement;
  const containerEl = arr[1] as ReactElement;
  return (
    <pre {...props} ref={preRef} className="relative !pt-10 !overflow-x-hidden">
      <div className="absolute top-0 right-0 left-0 flex items-center justify-between w-full px-6 py-2 pr-4 bg-muted-700 text-muted-100">
        <span className="text-xs lowercase">{lidEl.props.children}</span>
        <div className="flex items-center space-x-1">
          {
            <CopyToClipboard
              getValue={() =>
                preRef.current?.querySelector("code")?.textContent || ""
              }
            />
          }
        </div>
      </div>
      {containerEl}
    </pre>
  );
};
