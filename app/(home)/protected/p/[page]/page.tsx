import Pagination from "@/components/Pagination";
import { Posts } from "@/components/Posts";
import { POSTS_COUNT_PER_PAGE } from "@/constants";
import { PaginateOptions } from "@/lib/paginator";
import { getPageCount, getPosts, getProcessedPosts } from "@/lib/posts";
import { Suspense } from "react";

type SearchParams = PaginateOptions;

export const revalidate = 300;
//https://beta.nextjs.org/docs/data-fetching/fetching#segment-cache-configuration

export async function generateStaticParams() {
  const count = await getPageCount({
    perPage: POSTS_COUNT_PER_PAGE,
    protected: true,
    includeHiddenCategories: true,
  });
  const params = Array.from({ length: count }, (_, i) => ({
    page: String(i + 1),
  }));
  return params.slice(0, 2);
}

export default async function Home({
  searchParams,
  params,
}: {
  searchParams: SearchParams;
  params: {
    page: string | number | undefined;
  };
}) {
  const posts = await getProcessedPosts(
    await getPosts({
      page: params.page,
      protected: true,
      includeHiddenCategories: true,
    })
  );
  const pageCount = await getPageCount({
    perPage: POSTS_COUNT_PER_PAGE,
    protected: true,
  });

  return (
    <>
      <Posts data={posts} />
      <Suspense>
        <Pagination pageCount={pageCount} />
      </Suspense>
    </>
  );
}
