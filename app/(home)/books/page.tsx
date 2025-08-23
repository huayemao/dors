import { Books, BookSummary } from "@/components/Tiles/Books";
import { SITE_META } from "@/constants";
import { PaginateOptions } from "@/lib/paginator";
import { getPageCount, getPosts, getProcessedPosts } from "@/lib/server/posts";
import { BaseHeading, BaseIconBox } from "@glint-ui/react";

import { cache, Fragment, Suspense } from "react";

type SearchParams = PaginateOptions;

export const revalidate = 1200;

//https://beta.nextjs.org/docs/data-fetching/fetching#segment-cache-configuration

export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const posts = await getProcessedPosts(
    await getPosts({
      ...searchParams,
      protected: false,
      type: "normal",
    })
  );

  const books = (await getPosts({
    type: "book",
    includeHiddenCategories: true,
  })) as BookSummary[];

  const key = posts.map((e) => e.id).join();

  return (
    <Fragment key={key}>
      <section className="px-4 py-16 bg-muted-100 dark:bg-muted-800">
        <div className="max-w-5xl mx-auto">
          <BaseHeading
            as="h1"
            size="3xl"
            className="font-heading text-muted-900 dark:text-white"
          >
            知识库（果园）
          </BaseHeading>
          <p className="mt-1 text-sm text-muted-600 dark:text-muted-400">
            {SITE_META.introduction}
          </p>
          <div className="my-8 space-y-4">
            <Books data={books} />
          </div>
        </div>
      </section>
    </Fragment>
  );
}
