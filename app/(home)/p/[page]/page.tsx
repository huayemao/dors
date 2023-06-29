import FeaturedPosts from "@/components/FeaturedPosts";
import { Pagination } from "@/components/Pagination";
import PostTile from "@/components/PostTile";
import { POSTS_COUNT_PER_PAGE, SITE_META } from "@/constants";
import { getArticles, getProcessedArticles } from "@/lib/articles";
import { PaginateOptions } from "@/lib/paginator";
import prisma from "@/prisma/client";
import { cache } from "react";

type SearchParams = PaginateOptions;

export const revalidate = 300;
//https://beta.nextjs.org/docs/data-fetching/fetching#segment-cache-configuration

export async function generateStaticParams() {
  const count = await getPageCount(POSTS_COUNT_PER_PAGE);
  const params = Array.from({ length: count }, (_, i) => ({
    page: String(i + 1),
  }));
  return params;
}

const getPageCount = cache(async (perPage: number) => {
  const itemCount = await prisma.articles.count();
  return itemCount / (perPage || POSTS_COUNT_PER_PAGE);
});

export default async function Home({
  searchParams,
  params,
}: {
  searchParams: SearchParams;

  params: {
    page: string | number | undefined;
  };
}) {
  const articles = await getProcessedArticles(
    await getArticles({ page: params.page })
  );

  const pageCount = await getPageCount(
    searchParams.perPage ? Number(searchParams.perPage) : POSTS_COUNT_PER_PAGE
  );

  const isFirstPage = !(params.page && Number(params.page) > 1);

  return (
    <section className="w-full bg-muted-100 dark:bg-muted-900">
      <div className="w-full max-w-7xl mx-auto">
        <div className="w-full  px-6 pt-24 lg:pt-24  pb-16">
          <div className="w-full h-full flex flex-col justify-between">
            <div className="w-full max-w-3xl mx-auto space-y-4 text-center">
              <h1 className="font-heading font-extrabold text-5xl md:text-5xl text-muted-800 dark:text-white">
                {SITE_META.name}
              </h1>
              <p className=" font-sans text-base md:text-lg text-muted-500 dark:text-muted-400">
                {SITE_META.introduction}
              </p>
            </div>
            <div className="flex flex-col gap-12 py-12">
              {isFirstPage && <FeaturedPosts articles={[articles[0]]} />}
              <div className="grid ptablet:grid-cols-2 ltablet:grid-cols-3 lg:grid-cols-3 gap-6 -m-3">
                {articles.map((e) => (
                  /* @ts-ignore */
                  <PostTile article={e} url={e.url} key={e.id} />
                ))}
              </div>
            </div>
          </div>
          <Pagination pageCount={pageCount} />
        </div>
      </div>
    </section>
  );
}
