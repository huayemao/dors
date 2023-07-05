import { Posts } from "@/components/Posts";
import { POSTS_COUNT_PER_PAGE } from "@/constants";
import { PaginateOptions } from "@/lib/paginator";
import { getPosts, getProcessedPosts } from "@/lib/posts";
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
  const itemCount = await prisma.posts.count();
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
  const posts = await getProcessedPosts(await getPosts({ page: params.page }));

  const isFirstPage = !(params.page && Number(params.page) > 1);

  return (
    <>
      <Posts data={posts} showFeature={isFirstPage} />
    </>
  );
}
