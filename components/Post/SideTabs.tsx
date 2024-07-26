"use client";
import { BaseButton, BaseTabs } from "@shuriken-ui/react";
import { useMediaQuery } from "@uidotdev/usehooks";
import { Code2, MessageSquareIcon, PenBox } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Modal } from "../Base/Modal";
import { MiniPostTile } from "../MiniPostTile";
import { ShareButton } from "../ShareButton";


const TOC = dynamic(() => import("./toc"), {
  ssr: false,
});

const NavListPortal = dynamic(() => import("./NavListPortal"), {
  ssr: false,
});

function RecentPosts({ posts }) {
  return (
    <ul className="space-y-6">
      {posts.map((e) => (
        <MiniPostTile
          key={e.id}
          type="mini"
          post={e}
          url={e.url}
          blurDataURL={e.blurDataURL}
        />
      ))}
    </ul>
  );
}

export default function SideTabs({ post, posts }) {
  const [markdownOpen, setMarkdownOpen] = useState(false);
  const [key, setKey] = useState(0);
  const isMobile = useMediaQuery("only screen and (max-width : 992px)");

  useEffect(() => {
    // 强制 portal 重新渲染，不晓得是否有更好的方法
    setKey((v) => v + 1);
  }, []);

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
    </div>
  );

  return (
    <>
      <div className="hidden md:block">{renderTabs()}</div>
      {isMobile && (
        <NavListPortal key={post.id + key}>{renderTabs()}</NavListPortal>
      )}
      <Modal
        open={markdownOpen}
        onClose={() => {
          setMarkdownOpen(false);
        }}
        title={post.title}
      >
        <div className="p-4 whitespace-pre-wrap max-h-[82vh] overflow-y-auto overflow-x-hidden">
          {post.content}
        </div>
      </Modal>
    </>
  );

  function renderTabs() {
    return (
      <BaseTabs
        defaultValue="toc"
        tabs={[
          { label: "文章大纲", value: "toc" },
          { label: "选项", value: "actions" },
        ]}
      >
        {(activeValue) => (
          <>
            {activeValue === "actions" && (
              <div>
                <div>{Actions}</div>
                <hr className="my-6 border-t border-muted-200 dark:border-muted-800" />
                <h2 className="font-heading text-muted-800 dark:text-white font-semibold text-xl mb-6">
                  最近文章
                </h2>
                <RecentPosts posts={posts} />
              </div>
            )}
            {activeValue === "toc" && <TOC />}
          </>
        )}
      </BaseTabs>
    );
  }
}
