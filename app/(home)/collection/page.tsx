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
} from "@glint-ui/react";
import { ArrowRight, MoveRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cache, Fragment, Suspense } from "react";
import PostListItem from "@/components/PostListItem";

type SearchParams = Promise<PaginateOptions>;
type Posts = Awaited<ReturnType<typeof getProcessedPosts>>;

export const revalidate = 1200;

//https://beta.nextjs.org/docs/data-fetching/fetching#segment-cache-configuration

export default async function CollectionIndexPage(
  props: {
    searchParams: Promise<SearchParams>;
  }
) {
  const searchParams = await props.searchParams;
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
      <section className="px-4 py-16 bg-muted-100 dark:bg-muted-800">
        <div className="max-w-5xl mx-auto space-y-8">
          <BaseHeading
            as="h1"
            size="3xl"
            className="font-heading text-muted-900 dark:text-white"
          >
            集萃
          </BaseHeading>
          <p className="mt-1 text-sm text-muted-600 dark:text-muted-400">
            {SITE_META.introduction}
          </p>
          <BaseList className="max-w-3xl bg-white dark:bg-muted-800 p-4 rounded-lg shadow-lg">
            {posts.map((e, i) => (
              <PostListItem key={e.id} post={e} />
            ))}
          </BaseList>
        </div>
      </section>
    </Fragment>
  );
}
