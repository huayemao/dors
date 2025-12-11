import { CategoriesSwiper } from "@/components/CategoriesSwiper";
import { CatsAndTags } from "@/components/CatsAndTags";
import Pagination from "@/components/Pagination";
import { Posts } from "@/components/Tiles/Posts";
import { SITE_META } from "@/constants";
import { PaginateOptions } from "@/lib/paginator";
import { getPageCount, getPosts, getProcessedPosts } from "@/lib/server/posts";
import { BaseHeading } from "@glint-ui/react";
import { cache, Fragment, Suspense } from "react";

type SearchParams = PaginateOptions;
type Posts = Awaited<ReturnType<typeof getProcessedPosts>>;

export const revalidate = 1200;

//https://beta.nextjs.org/docs/data-fetching/fetching#segment-cache-configuration

export default async function Home(
  props: {
    searchParams: Promise<SearchParams>;
  }
) {
  const searchParams = await props.searchParams;
  const posts = await getProcessedPosts(
    await getPosts({
      ...searchParams,
      protected: false,
      type: "normal",
    })
  );

  const key = posts.map((e) => e.id).join();
  const pageCount = await getPageCount();
  return (
    <Fragment key={key}>
      <section className="px-4 py-16 bg-muted-100 dark:bg-muted-800">
        <div className="max-w-5xl mx-auto">
          <BaseHeading
            as="h1"
            size="3xl"
            className="font-heading text-muted-900 dark:text-white"
          >
            博客（花坛）
          </BaseHeading>
          <p className="mt-1 text-sm text-muted-600 dark:text-muted-400">
            {SITE_META.introduction}
          </p>
          <div className="space-y-4">
            <CategoriesSwiper />
            <Posts data={posts} mini />
            <Suspense>
              <Pagination pageCount={pageCount}></Pagination>
            </Suspense>{" "}
          </div>
        </div>
      </section>
    </Fragment>
  );
}
