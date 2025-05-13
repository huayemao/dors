import { Panel } from "@/components/Base/Panel";
import { getPosts, getPageCount } from "@/lib/server/posts";
import { BaseButtonAction } from "@shuriken-ui/react";
import { PostsTable } from "./PostsTable";
import { PaginateOptions } from "@/lib/paginator";
import Pagination from "@/components/Pagination";
import { Suspense } from "react";

type SearchParams = PaginateOptions;

export default async function PostsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const posts = await getPosts({
    ...searchParams,
    includeHiddenCategories: true,
  });
  const pageCount = await getPageCount({ includeHiddenCategories: true });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-muted-700 dark:text-white">文章管理</h1>
        <BaseButtonAction href={"/admin/posts/create"}>创建文章</BaseButtonAction>
      </div>
      <Panel title="文章列表" className="max-w-full">
        <PostsTable posts={posts}></PostsTable>
        <div className="mt-4">
          <Suspense>
            <Pagination pageCount={pageCount}></Pagination>
          </Suspense>
        </div>
      </Panel>
    </div>
  );
}

