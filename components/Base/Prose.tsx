import c from "@/styles/prose.module.css";
import LightBox from "./LightBox";
import ParsedMdx from "./parsedMdx";
import { cn } from "@/lib/utils";

export default Prose;

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
    </>
  );
}
