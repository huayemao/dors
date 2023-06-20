import PostTile from "@/components/PostTile";
import Tag from "@/components/Tag";
import { getArticles } from "@/lib/articles";
import { getBase64Image } from "@/lib/getBase64Image";
import { PaginateOptions } from "@/lib/paginator";
import { PexelsPhoto } from "@/lib/types/PexelsPhoto";
import prisma from "@/prisma/client";
import Image from "next/image";
import Link from "next/link";

type SearchParams = PaginateOptions;

export const revalidate = 300;
//https://beta.nextjs.org/docs/data-fetching/fetching#segment-cache-configuration

export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const articles = await getArticles(searchParams);

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

  //   useEffect(() => {
  //     (async () => {
  //       const res = await fetch("/v1/users/login", {
  //         headers: {
  //           "content-type": "application/json",
  //         },
  //         body: '{"username":"huayemao","password":"huayemao123"}',
  //         method: "POST",
  //         mode: "cors",
  //         credentials: "include",
  //       }).then((r) => r.json());

  //       localStorage.setItem("access_token", res.data.token.access_token);
  //     })();
  //   });

  return (
    <section className="w-full bg-muted-100 dark:bg-muted-900">
      <div className="w-full max-w-7xl mx-auto">
        <div className="w-full flex items-center overflow-hidden">
          <div
            className="
                w-full
                h-full
                flex flex-col
                justify-between
                px-6
                pt-36
                lg:pt-36
                pb-16
              "
          >
            <div className="flex flex-col gap-12 py-12">
              <div className="flex flex-col ltablet:flex-row lg:flex-row gap-6 -m-3">
                <div className="w-full ltablet:w-2/3 lg:w-2/3">
                  <Link
                    href={"/posts/" + articles[0].id}
                    className="
                          h-full
                          grid
                          md:grid-cols-2
                          rounded-xl
                          bg-white
                          dark:bg-muted-800
                          border border-muted-200
                          dark:border-muted-700
                          w-full
                          max-w-4xl
                          mx-auto
                          overflow-hidden
                        "
                  >
                    <div className="h-full p-5">
                      <Image
                        className="block h-full w-full object-cover rounded-xl"
                        /* @ts-ignore */
                        src={articles[0].url}
                        alt="Woman wondering"
                        width="365"
                        height="356"
                      />
                    </div>
                    <div
                      className="
                            flex flex-col
                            items-start
                            gap-4
                            px-6
                            md:px-10
                            py-8
                            -mt-8
                            md:mt-0 md:-ml-5
                          "
                    >
                      <div className="w-full space-y-4">
                        <div className="relative space-x-2">
                          {!!articles[0]?.tags?.length &&
                            articles[0].tags.map(
                              (t) =>
                                t && (
                                  <Tag
                                    key={t.id}
                                    type="secondary"
                                    text={t.name as string}
                                  />
                                )
                            )}
                        </div>
                        <h3
                          className="
                                font-heading
                                text-2xl
                                font-semibold
                                text-muted-800
                                dark:text-white
                                leading-8
                              "
                        >
                          {articles[0].title}
                        </h3>
                      </div>

                      <div className="w-full mt-auto space-y-6">
                        <p
                          className="
                                text-base
                                mt-auto
                                text-muted-600
                                dark:text-muted-400
                                leading-6
                              "
                        >
                          {articles[0].excerpt}
                        </p>
                        <div className="flex items-center justify-start w-full relative">
                          <div className="bg-rose-50 mask flex items-center justify-center mask-blob w-12 h-12 text-[36px]">
                            <Image
                              alt="花野猫"
                              src={"/img/huayemao.svg"}
                              width={44}
                              height={44}
                            />
                          </div>
                          <div className="pl-2">
                            <h3
                              className="
                      font-heading font-medium 
                      text-muted-800
                      dark:text-muted-50
                    "
                            >
                              花野猫
                            </h3>
                            <p className="font-sans text-sm text-muted-400">
                              {articles?.[0]?.published_at?.toLocaleString()}
                            </p>
                          </div>
                          <div className="block ml-auto font-sans text-sm text-muted-400">
                            <span>— 5 min read</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="w-full ltablet:w-1/3 lg:w-1/3">
                  <Link
                    href={"/posts/" + articles[1].id}
                    className="
                          block
                          h-full
                          rounded-xl
                          bg-white
                          dark:bg-muted-800
                          border border-muted-200
                          dark:border-muted-700
                          w-full
                          max-w-4xl
                          mx-auto
                          overflow-hidden
                        "
                  >
                    <div className="h-full flex flex-col items-start gap-4 px-6 md:px-10 py-8">
                      <div className="w-full space-y-4">
                        <div className="relative space-x-2">
                          {!!articles[1]?.tags?.length &&
                            articles[1].tags.map(
                              (t) =>
                                t && (
                                  <Tag
                                    key={t.id}
                                    type="secondary"
                                    text={t.name as string}
                                  />
                                )
                            )}
                        </div>
                        <h3
                          className="
                                font-heading
                                text-2xl
                                font-semibold
                                text-muted-800
                                dark:text-white
                                leading-8
                              "
                        >
                          {articles[1].title}
                        </h3>
                      </div>

                      <div className="w-full mt-auto space-y-6">
                        <p
                          className="
                                text-base
                                mt-auto
                                text-muted-600
                                dark:text-muted-400
                                leading-6
                              "
                        >
                          {articles[1].excerpt}
                        </p>
                        <div className="flex items-center justify-start w-full relative">
                          <div className="bg-rose-50 mask flex items-center justify-center mask-blob w-12 h-12 text-[36px]">
                            <Image
                              alt="花野猫"
                              src={"/img/huayemao.svg"}
                              width={44}
                              height={44}
                            />
                          </div>
                          <div className="pl-2">
                            <h3
                              className="
                                    font-heading font-medium
                                    text-muted-800
                                    dark:text-muted-50
                                  "
                            >
                              花野猫
                            </h3>
                            <p className="font-sans text-sm text-muted-400">
                              {articles[1].published_at?.toLocaleString()}
                            </p>
                          </div>
                          <div className="block ml-auto font-sans text-sm text-muted-400">
                            <span>— 3 min read</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
              <div
                className="
                      grid
                      ptablet:grid-cols-2
                      ltablet:grid-cols-3
                      lg:grid-cols-3
                      gap-6
                      -m-3
                    "
              >
                {articles.slice(2).map((e) => (
                  /* @ts-ignore */
                  <PostTile article={e} url={e.url} key={e.id} />
                ))}
              </div>
            </div>
          </div>
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
