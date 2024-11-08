import c from "@/styles/prose.module.css";
import LightBox from "./LightBox";
import ParsedMdx from "./parsedMdx";
import { cn } from "@/lib/utils";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

export default Prose;

const ErrorComp = ({ error }) => <div>出错了：{error.message}</div>;

function Prose({
  content,
  preview = false,
  className,
}: {
  content;
  preview?: boolean;
  className?: string;
}) {
  return (
    <>
      <ErrorBoundary errorComponent={ErrorComp}>
        {typeof content == "string" ? (
          <ParsedMdx className={className} preview={preview} content={content} />
        ) : (
          <>
            <article
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
      </ErrorBoundary>
    </>
  );
}
