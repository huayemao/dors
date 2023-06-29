import FeaturedPosts from "@/components/FeaturedPosts";
import { Pagination } from "@/components/Pagination";
import PostTile from "@/components/PostTile";
import { POSTS_COUNT_PER_PAGE, SITE_META } from "@/constants";
import { getArticles } from "@/lib/articles";
import { getBase64Image } from "@/lib/getBase64Image";
import { PaginateOptions } from "@/lib/paginator";
import { PexelsPhoto } from "@/lib/types/PexelsPhoto";
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
  const articles = await getArticles(searchParams);
  const pageCount = await getPageCount(Number(searchParams.perPage));

  const needImageIds = articles.filter((e) => !e.cover_image).map((e) => e.id);

  let imageData;

  if (needImageIds.length) {
    imageData = await getImages(articles.length);
  }

  for (const i in articles) {
    const a = articles[i];

    if (needImageIds.includes(a.id)) {
      await prisma.articles.update({
        where: {
          id: a.id,
        },
        data: {
          cover_image: imageData.photos[i],
        },
      });

      a.cover_image = imageData.photos[i];
    }

    // @ts-ignore
    articles[i].url = await getBase64Image(
      (a.cover_image as PexelsPhoto).src.large
    );
  }

  const isFirstPage = !searchParams.page || Number(searchParams.page) <= 1;

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

async function getImages(length) {
  return await fetch(
    `https://api.pexels.com/v1/search?query=pastel&per_page=${length}&page=${
      Math.floor(Math.random() * 100) + 1
    }&orientation=landscape`,
    {
      headers: {
        Authorization:
          "VIIq3y6ksXWUCdBRN7xROuRE7t6FXcX34DXyiqjnsxOzuIakYACK402j",
      },
    }
  ).then((res) => res.json());
}
