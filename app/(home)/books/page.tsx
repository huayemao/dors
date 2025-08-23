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

  const books = await getPosts({ 
    type: "book",
    includeHiddenCategories: true 
  }) as BookSummary[];


  const key = posts.map((e) => e.id).join();

  return (
    <Fragment key={key}>
      <h1 className="font-heading leading-normal font-extrabold text-5xl md:text-5xl text-muted-700 dark:text-white text-center  mb-4">
        知识库
      </h1>
      <p className="text-center font-sans text-base md:text-lg text-muted-500 dark:text-muted-400">
        这里是这座数字花园中的果园，生长着{SITE_META.author.name}辛勤劳作产生的果实
      </p>
      <div className="space-y-8">
          <Books data={books}/>
      </div>
    </Fragment>
  );
}


