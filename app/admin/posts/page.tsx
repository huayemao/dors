import { Panel } from "@/components/Base/Panel";
import { getPosts } from "@/lib/server/posts";
import { BaseButtonAction } from "@shuriken-ui/react";
import { PostsTable } from "./PostsTable";

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <>
      <BaseButtonAction href={"/admin/posts/create"}>创建文章</BaseButtonAction>
      <Panel title="文章列表" className="max-w-full">
        <PostsTable posts={posts}></PostsTable>
      </Panel>
    </>
  );
}

