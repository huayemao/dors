"use client";
import { BaseButton, BaseHeading, BaseTabs } from "@glint-ui/react";
import { useMediaQuery } from "@uidotdev/usehooks";
import { Code2, MessageSquareIcon, PenBox } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Modal } from "../Base/Modal";
import { MiniPostTile } from "../Tiles/MiniPostTile";
import { ShareButton } from "../ShareButton";
import { CopyToClipboard } from "../copy-to-clipboard";
import { AnimatePresence } from "framer-motion";
import RelatedContent from "./RelatedContent";
import TOC from "./toc";

export default function Aside({ post, posts, toc }) {
  return (
    <>
      <div className="hidden md:block sticky top-20">
        <SimpleAside post={post} posts={posts} toc={toc} />
        <hr className="my-6 border-t border-muted-200 dark:border-muted-800" />
        <RelatedContent posts={posts} />
      </div>
    </>
  );
}

export const SimpleAside = ({ post, posts, toc }) => {
  return (
    <>
      {toc && toc.length > 0 && (
        <div className="mt-6">
          <BaseHeading
            as="h3"
            className="font-heading text-muted-800 dark:text-white font-semibold text-lg mb-6"
          >
            文章大纲
          </BaseHeading>
          <TOC toc={toc} />
        </div>
      )}
      <hr className="my-6 border-t border-muted-200 dark:border-muted-800" />
      <ActionTabs post={post} posts={posts} toc={toc} />
    </>
  );
};

export function ActionTabs({ post, posts, toc }) {
  const [markdownOpen, setMarkdownOpen] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  const tabs = [{ label: "选项", value: "actions" }];

  const Actions = (
    <div className="flex justify-between gap-3">
      <ShareButton
        options={{
          title: post.title,
        }}
      />
      <BaseButton
        className="flex-1"
        color="muted"
        size="lg"
        href={`/admin/posts/${post.id}`}
      >
        <PenBox className="w-4 h-4 " fill="currentColor" />
      </BaseButton>
      <BaseButton
        className="flex-1"
        color="muted"
        size="lg"
        href={`https://www.yuque.com/huayemao/yuque/dc_${post.id}`}
      >
        <MessageSquareIcon className="w-4 h-4 " fill="currentColor" />
      </BaseButton>
      <BaseButton
        className="flex-1"
        color="muted"
        size="lg"
        onClick={() => {
          setMarkdownOpen(true);
        }}
      >
        <Code2 className="w-4 h-4 " fill="currentColor" />
      </BaseButton>
      <AnimatePresence>
        <Modal
          key={String(markdownOpen)}
          actions={
            <>{<CopyToClipboard getValue={() => ref.current!.innerText} />}</>
          }
          className={"whitespace-pre-wrap"}
          open={markdownOpen}
          onClose={() => {
            setMarkdownOpen(false);
          }}
          title={post.title}
        >
          <div ref={ref}>{post.content}</div>
        </Modal>
      </AnimatePresence>
    </div>
  );

  return (
    <>
      <BaseTabs defaultValue={tabs[0].value} tabs={tabs}>
        {(activeValue) => (
          <>
            {activeValue === "actions" && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-500 dark:text-muted-400 font-mono">
                    {post.slug
                      ? "文章 Slug: " + post.slug
                      : "文章 ID: " + post.id}
                  </span>
                  <CopyToClipboard getValue={() => post.slug || post.id} />
                </div>
                <div>{Actions}</div>
              </div>
            )}
          </>
        )}
      </BaseTabs>
    </>
  );
}
