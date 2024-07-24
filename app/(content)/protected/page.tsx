import Pagination from "@/app/(home)/Pagination";
import { Posts } from "@/components/Posts";
import { PaginateOptions } from "@/lib/paginator";
import { getPageCount, getPosts, getProcessedPosts } from "@/lib/posts";
import { Suspense } from "react";

type SearchParams = PaginateOptions;
type Posts = Awaited<ReturnType<typeof getProcessedPosts>>;

export const revalidate = 300;
//https://beta.nextjs.org/docs/data-fetching/fetching#segment-cache-configuration

export default async function Protected({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const posts = await getProcessedPosts(
    await getPosts({
      ...searchParams,
      protected: true,
    })
  );

  const pageCount = await getPageCount({ protected: true });

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Posts data={posts} />
      <Suspense>
        <Pagination pageCount={pageCount}></Pagination>
      </Suspense>
    </div>
  );
}
