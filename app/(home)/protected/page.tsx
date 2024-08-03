import { Posts } from "@/components/Posts";
import { PaginateOptions } from "@/lib/paginator";
import { getPageCount, getPosts, getProcessedPosts } from "@/lib/posts";
import { Suspense } from "react";
import Pagination from "./Pagination";

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
