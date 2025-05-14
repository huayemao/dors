import { CatsAndTags } from "@/components/CatsAndTags";
import Pagination from "@/components/Pagination";
import { SITE_META } from "@/constants";
import { PaginateOptions } from "@/lib/paginator";
import { getPageCount, getPosts, getProcessedPosts } from "@/lib/server/posts";
import {
  BaseHeading,
  BaseIconBox,
  BaseList,
  BaseListItem,
} from "@shuriken-ui/react";
import { ArrowRight, MoveRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cache, Fragment, Suspense } from "react";
import PostListItem from "@/components/PostListItem";

type SearchParams = PaginateOptions;
type Posts = Awaited<ReturnType<typeof getProcessedPosts>>;

export const revalidate = 1200;

//https://beta.nextjs.org/docs/data-fetching/fetching#segment-cache-configuration

export default async function CollectionIndexPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const posts = await getProcessedPosts(
    await getPosts({
      ...searchParams,
      protected: false,
      type: "collection",
    })
  );

  const key = posts.map((e) => e.id).join();
  return (
    <Fragment key={key}>
      <h1 className="font-heading leading-normal font-extrabold text-5xl md:text-5xl text-muted-700 dark:text-white text-center  mb-4">
        集萃
      </h1>
      <div className="gap-4 flex flex-col items-center">
        <p className="text-center font-sans text-base md:text-lg text-muted-500 dark:text-muted-400">
          {SITE_META.introduction}
        </p>

        <BaseList className="max-w-3xl bg-white dark:bg-muted-800 p-4 rounded-lg shadow-lg">
          {posts.map((e, i) => (
            <PostListItem key={e.id} post={e} />
          ))}
        </BaseList>
      </div>
    </Fragment>
  );
}
