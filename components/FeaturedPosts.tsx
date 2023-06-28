import { getArticles } from "@/lib/articles";
import { getDateString } from "@/lib/utils";
import huayemao from "@/public/img/huayemao.svg";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Tag from "./Tag";
interface Props {
  articles: Awaited<ReturnType<typeof getArticles>>;
}

const FeaturedPosts: React.FC<Props> = ({ articles }) => {
  return (
    <div className="flex flex-col ltablet:flex-row lg:flex-row gap-6 -m-3">
      <div className="w-full ltablet:w-2/3 lg:w-2/3">
        <Link
          href={"/posts/" + articles[0].id}
          className="h-full grid md:grid-cols-2 rounded-xl bg-white dark:bg-muted-800 border border-muted-200 dark:border-muted-700 w-full max-w-4xl mx-auto overflow-hidden
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
          <div className=" flex flex-col items-start gap-4 px-6 md:px-10 py-8 -mt-8 md:mt-0 md:-ml-5">
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
              <h3 className=" font-heading text-2xl font-semibold text-muted-800 dark:text-white leading-8">
                {articles[0].title}
              </h3>
            </div>

            <div className="w-full mt-auto space-y-6">
              <p
                className=" text-base mt-auto text-muted-600 dark:text-muted-400 leading-6
                "
              >
                {articles[0].excerpt}
              </p>
              <div className="flex items-center justify-start w-full relative">
                <div className="bg-rose-50 mask flex items-center justify-center mask-blob w-12 h-12 text-[36px]">
                  <Image alt="花野猫" src={huayemao} width={44} height={44} />
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
                    {articles?.[0]?.published_at
                      ? getDateString(articles?.[0]?.published_at)
                      : ""}
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
          className="block h-full rounded-xl bg-white dark:bg-muted-800 border border-muted-200 dark:border-muted-700 w-full max-w-4xl mx-auto overflow-hidden
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
                className="font-heading text-2xl font-semibold text-muted-800 dark:text-white leading-8
                "
              >
                {articles[1].title}
              </h3>
            </div>

            <div className="w-full mt-auto space-y-6">
              <p className="text-base mt-auto text-muted-600 dark:text-muted-400 leading-6">
                {articles[1].excerpt}
              </p>
              <div className="flex items-center justify-start w-full relative">
                <div className="bg-rose-50 mask flex items-center justify-center mask-blob w-12 h-12 text-[36px]">
                  <Image alt="花野猫" src={huayemao} width={44} height={44} />
                </div>
                <div className="pl-2">
                  <h3
                    className=" font-heading font-medium text-muted-800 dark:text-muted-50
                    "
                  >
                    花野猫
                  </h3>
                  <p className="font-sans text-sm text-muted-400">
                    {articles?.[1]?.published_at
                      ? getDateString(articles?.[1]?.published_at)
                      : ""}
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
  );
};

export default FeaturedPosts;
