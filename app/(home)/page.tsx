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

const getPageCount = cache(async (perPage: number) => {
  const itemCount = await prisma.articles.count();
  return itemCount / (perPage || POSTS_COUNT_PER_PAGE);
});

export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const articles = await getProcessedArticles(await getArticles(searchParams));
  const pageCount = await getPageCount(Number(searchParams.perPage));

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
            <div className="w-full max-w-lg mx-auto my-4 space-y-4 text-center">
              {/* <div className="w-full relative">
                <label className="hidden font-alt text-sm text-muted-400">
                  Search
                </label>
                <div className="group relative">
                  <input
                    type="text"
                    className=" pl-16 pr-5 py-3 h-16 text-base leading-5 font-sans w-full rounded-xl bg-white text-muted-600 border border-muted-300 focus:border-muted-300 focus:shadow-lg focus:shadow-muted-300/50 dark:focus:shadow-muted-800/50 placeholder:text-muted-300 dark:placeholder:text-muted-500 dark:bg-muted-800 dark:text-muted-200 dark:border-muted-700 dark:focus:border-muted-600 transition-all duration-300 tw-accessibility
                      "
                    placeholder="Search blog articles..."
                  />
                  <div
                    className=" absolute top-0 left-0 h-16 w-16 flex justify-center items-center text-muted-400 group-focus-within:text-primary-500 transition-colors duration-300
                      "
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      role="img"
                      width="1em"
                      height="1em"
                      viewBox="0 0 24 24"
                      data-icon="lucide:search"
                      className="iconify w-6 h-6 iconify--lucide"
                    >
                      <g
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                      >
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21l-4.35-4.35"></path>
                      </g>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="relative w-full flex justify-center gap-4 flex-wrap">
                <Category active>xxx</Category>
              </div> */}
            </div>
            <div className="flex flex-col gap-12 py-12">
              <FeaturedPosts articles={[articles[0]]} />
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
