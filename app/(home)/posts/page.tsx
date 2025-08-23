import { CatsAndTags } from "@/components/CatsAndTags";
import Pagination from "@/components/Pagination";
import { Posts } from "@/components/Tiles/Posts";
import { SITE_META } from "@/constants";
import { PaginateOptions } from "@/lib/paginator";
import { getPageCount, getPosts, getProcessedPosts } from "@/lib/server/posts";
import { BaseHeading } from "@shuriken-ui/react";
import { cache, Fragment, Suspense } from "react";

type SearchParams = PaginateOptions;
type Posts = Awaited<ReturnType<typeof getProcessedPosts>>;

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

  const key = posts.map((e) => e.id).join();
  const pageCount = await getPageCount();
  return (
    <Fragment key={key}>
      <section className="container mx-auto px-4">
        <h1 className="font-heading leading-normal font-extrabold text-5xl md:text-5xl text-muted-700 dark:text-white text-center  mb-4">
          {SITE_META.name + " " + SITE_META.description}
        </h1>
        <CatsAndTags simple></CatsAndTags>
        <div className="space-y-4">
          <BaseHeading size="3xl" className="text-center" as="h2">
            博客
          </BaseHeading>
          <p className="text-center font-sans text-base md:text-lg text-muted-500 dark:text-muted-400">
            {SITE_META.introduction}
          </p>
          <Posts data={posts} mini />
          <Suspense>
            <Pagination pageCount={pageCount}></Pagination>
          </Suspense>{" "}
        </div>
      </section>
    </Fragment>
  );
}
