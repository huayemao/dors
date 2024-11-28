import Pagination from "@/components/Pagination";
import { Posts } from "@/components/Posts";
import { PaginateOptions } from "@/lib/paginator";
import { getPageCount, getPosts, getProcessedPosts } from "@/lib/posts";
import { cache, Suspense } from "react";

type SearchParams = PaginateOptions;
type Posts = Awaited<ReturnType<typeof getProcessedPosts>>;

export const revalidate = 36000;
//https://beta.nextjs.org/docs/data-fetching/fetching#segment-cache-configuration

export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const posts = await cache(getProcessedPosts)(
    await getPosts({
      ...searchParams,
      protected: false,
    })
  );

  const pageCount = await getPageCount();

  return (
    <>
      <Posts data={posts} />
      <Suspense>
        <Pagination pageCount={pageCount}></Pagination>
      </Suspense>
    </>
  );
}
