import c from "@/styles/prose.module.css";
import LightBox from "./LightBox";
import ParsedMdx from "./parsedMdx";
import { cn } from "@/lib/utils";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { ClientOnly } from "../ClientOnly";
import { forwardRef, Ref } from "react";

const ErrorComp = ({ error }) => <div>出错了：{error.message}</div>;

const Prose = forwardRef(function P(
  {
    content,
    preview = false,
    className,
  }: {
    content;
    preview?: boolean;
    className?: string;
  },
  ref: Ref<HTMLElement>
) {
  return (
    <>
      {typeof content == "string" ? (
        // <ClientOnly>
        //   <ErrorBoundary errorComponent={ErrorComp}>
        <ParsedMdx className={className} preview={preview} content={content} />
      ) : (
        //   </ErrorBoundary>
        // </ClientOnly>
        <>
          <article
            ref={ref}
            className={cn(
              c.content,
              "dark:prose-invert prose lg:prose-xl py-6 overflow-hidden",
              className
            )}
          >
            {content}
          </article>
          <LightBox />
        </>
      )}
    </>
  );
});

export default Prose;
