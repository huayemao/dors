"use client";
import { BaseButton, BaseTabs } from "@shuriken-ui/react";
import { Edit, MessageSquareIcon, ViewIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
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
  const [modalOpen, setModalOpen] = useState(false);
  const [markdownOpen, setMarkdownOpen] = useState(false);
  const Actions = (
    <div className="flex justify-between gap-4">
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
        <Edit className="w-4 h-4 " fill="currentColor" />
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
        <ViewIcon className="w-4 h-4 " fill="currentColor" />
      </BaseButton>
    </div>
  );

  return (
    <>
      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
        title={post.title}
      >
        <div className="p-4 "> {renderTabs()}</div>
      </Modal>
      <div className="hidden md:block">{renderTabs()}</div>
      {<NavListPortal onclick={() => setModalOpen(true)}></NavListPortal>}
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
