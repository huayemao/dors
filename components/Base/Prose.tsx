import c from "@/styles/prose.module.css";
import LightBox from "./LightBox";
import ParsedMdx from "./parsedMdx";
import { cn } from "@/lib/utils";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { ClientOnly } from "../ClientOnly";
import { forwardRef, Ref } from "react";
import { components } from "@/lib/mdx/useComponents";
import { BaseCard, BaseHeading } from "@glint-ui/react";

const Prose = forwardRef(function P(
  {
    content:MDXContent ,
    preview = false,
    className,
    onLoadingChange,
  }: {
    content;
    preview?: boolean;
    className?: string;
    onLoadingChange?: (loading: boolean) => void;
  },
  ref: Ref<HTMLElement>
) {
  // Container component for navigation items
  const Container = (props: any) => (
    <BaseCard
      key={props.id}
      className={cn("my-4 p-4 max-w-lg md:max-w-sm  break-inside-avoid", {
        "mt-0": props.i === "0",
      })}
    >
      <BaseHeading as="h3" size="2xl">
        {props.tags}
      </BaseHeading>
      {props.children}
    </BaseCard>
  );

  return (
    <>
      {typeof MDXContent == "string" ? (
        <ClientOnly>
          <ParsedMdx 
            className={className} 
            preview={preview} 
            content={MDXContent} 
            onLoadingChange={onLoadingChange}
          />
        </ClientOnly>
      ) : (
        <>
          <article
            ref={ref}
            className={cn(
              c.content,
              "dark:prose-invert prose lg:prose-xl py-6 overflow-hidden",
              className
            )}
          >
            <MDXContent components={{ ...components, Container }} />
          </article>
          <LightBox />
        </>
      )}
    </>
  );
});

export default Prose;
