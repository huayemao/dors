import Pagination from "@/components/Pagination";
import { Posts } from "@/components/Tiles/Posts";
import { PaginateOptions } from "@/lib/paginator";
import { getPageCount, getPosts, getProcessedPosts } from "@/lib/server/posts";
import { Suspense } from "react";

type SearchParams = PaginateOptions;
type Posts = Awaited<ReturnType<typeof getProcessedPosts>>;

export const revalidate = 120;

export default async function Protected({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const posts = await getProcessedPosts(
    await getPosts({
      ...searchParams,
      protected: true,
      includeHiddenCategories:true
    })
  );

  const pageCount = await getPageCount({ protected: true });

  return (
    <>
      <Posts data={posts} />
      <Suspense>
        <Pagination pageCount={pageCount}></Pagination>
      </Suspense>
    </>
  );
}
