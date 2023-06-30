import FeaturedPosts from "@/components/FeaturedPosts";
import PostTile from "@/components/PostTile";
import { POSTS_COUNT_PER_PAGE } from "@/constants";
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
    <>
      {isFirstPage && <FeaturedPosts articles={[articles[0]]} />}
      <div className="grid ptablet:grid-cols-2 ltablet:grid-cols-3 lg:grid-cols-3 gap-6 -m-3">
        {articles.map((e) => (
          /* @ts-ignore */
          <PostTile article={e} url={e.url} key={e.id} />
        ))}
      </div>
    </>
  );
}
