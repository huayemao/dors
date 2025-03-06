import { CatsAndTags } from "@/components/CatsAndTags";
import Pagination from "@/components/Pagination";
import { Posts } from "@/components/Posts";
import { SITE_META } from "@/constants";
import { PaginateOptions } from "@/lib/paginator";
import { getPageCount, getPosts, getProcessedPosts } from "@/lib/posts";
import { BaseHeading, BaseIconBox, BaseList, BaseListItem } from "@shuriken-ui/react";
import { ArrowRight, MoveRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cache, Fragment, Suspense } from "react";

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
      type: 'collection'
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
            <li className="rounded-xl hover:bg-muted-100 focus-within:bg-muted-100 dark:hover:bg-muted-700/70 dark:focus-within:bg-muted-700/70 group flex items-center gap-3 p-2">
              <div className="nui-avatar nui-avatar-md nui-avatar-rounded-full bg-primary-100 dark:bg-primary-500/20 text-primary-500 ms-1 shrink-0">
                <Image
                  className="h-12 w-12 mask mask-blob object-cover"
                  src={e.url}
                  alt={e.title || "Post image"}
                  width="48"
                  height="48"
                  blurDataURL={e.blurDataURL}
                />
              </div><div>
                <h4 className="nui-heading nui-heading-md nui-weight-semibold  text-muted-800 dark:text-white">
                  <span>{e.title}</span>
                </h4>
                <p className="nui-paragraph nui-paragraph-sm nui-weight-normal nui-lead-normal">
                  <span className="text-muted-400">{e.excerpt}</span>
                </p>
              </div>
              <div className="ms-auto flex -translate-x-1 items-center opacity-0 transition-all duration-300 group-focus-within:translate-x-0 group-focus-within:opacity-100 group-hover:translate-x-0 group-hover:opacity-100">
                <Link aria-current="page" href={"/notes/" + e.id} className="nui-button-icon nui-button-rounded-lg nui-button-medium nui-button-default scale-90" >
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </li >
          ))}
        </BaseList>


      </div>
    </Fragment>
  );
}



