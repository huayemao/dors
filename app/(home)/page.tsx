import { CatsAndTags } from "@/components/CatsAndTags";
import { Posts } from "@/components/Tiles/Posts";
import { SITE_META } from "@/constants";
import { PaginateOptions } from "@/lib/paginator";
import {
  getPageCount,
  getPosts,
  getProcessedPosts,
  getRecentPosts,
} from "@/lib/server/posts";
import { BaseHeading, BaseIconBox } from "@shuriken-ui/react";
import Icon from "@/components/Base/Icon";
import Link from "next/link";
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
  const posts = await getRecentPosts();

  const key = posts.map((e) => e.id).join();

  return (
    <Fragment key={key}>
      <h1 className="font-heading leading-normal font-extrabold text-5xl md:text-5xl text-muted-700 dark:text-white text-center  mb-4">
        {SITE_META.name + " " + SITE_META.description}
      </h1>
      <p className="text-center font-sans text-base md:text-lg text-muted-500 dark:text-muted-400">
        {SITE_META.introduction}
      </p>
      <CatsAndTags simple></CatsAndTags>
      <div className="space-y-8">
        <div className="space-y-4">
          <BaseHeading size="3xl" className="text-center" as="h2">
            最近更新
          </BaseHeading>
          <Posts data={posts} mini />
        </div>
      </div>
    </Fragment>
  );
}
