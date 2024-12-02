import { CatsAndTags } from "@/components/CatsAndTags";
import Pagination from "@/components/Pagination";
import { Posts } from "@/components/Posts";
import { SITE_META } from "@/constants";
import { PaginateOptions } from "@/lib/paginator";
import { getPageCount, getPosts, getProcessedPosts } from "@/lib/posts";
import { BaseHeading } from "@shuriken-ui/react";
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
      <CatsAndTags  simple></CatsAndTags>
      <div className="space-y-4">
        <BaseHeading size="3xl" className="text-center" as="h2">
          文章
        </BaseHeading>
        <p className="text-center font-sans text-base md:text-lg text-muted-500 dark:text-muted-400">
          {SITE_META.introduction}
        </p>
        <Posts data={posts} />
        <Suspense>
          <Pagination pageCount={pageCount}></Pagination>
        </Suspense>
      </div>
    </>
  );
}
