import Pagination from "@/components/Pagination";
import { Posts } from "@/components/Tiles/Posts";
import { PaginateOptions } from "@/lib/paginator";
import { getPageCount, getPosts, getProcessedPosts } from "@/lib/server/posts";
import { Fragment, Suspense } from "react";

type SearchParams = PaginateOptions;
type Posts = Awaited<ReturnType<typeof getProcessedPosts>>;

export const revalidate = 120;

export default async function Protected(
  props: {
    searchParams: Promise<SearchParams>;
  }
) {
  const searchParams = await props.searchParams;
  const posts = await getProcessedPosts(
    await getPosts({
      ...searchParams,
      protected: true,
      includeHiddenCategories: true,
    })
  );
  const key = posts.map((e) => e.id).join();
  const pageCount = await getPageCount({ protected: true });

  return (
    <Fragment key={key}>
      <section className="px-4 py-16 bg-muted-100 dark:bg-muted-800">
        <div className="max-w-5xl mx-auto">
          <Posts mini data={posts} />
          <Suspense>
            <Pagination pageCount={pageCount}></Pagination>
          </Suspense>
        </div>
      </section>
    </Fragment>
  );
}
