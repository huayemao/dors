import { getArticle, getArticles } from "@/lib/articles";
import { markdownExcerpt, markdownToHtml } from "@/lib/utils";
import { Prisma } from "@/prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const revalidate = 600;

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((article) => ({
    id: article.id,
  }));
}

type PexelsPhoto = {
  id: number;
  alt: string;
  src: {
    tiny: string;
    large: string;
    small: string;
    medium: string;
    large2x: string;
    original: string;
    portrait: string;
    landscape: string;
  };
  url: string;
  liked: boolean;
  width: number;
  height: number;
  avg_color: string;
  photographer: string;
  photographer_id: number;
  photographer_url: string;
};

async function page({ params }) {
  const article = await getArticle(Number(params.id as string));
  const content = await markdownToHtml(article?.content);
  const coverImage = article?.cover_image
    ? ((article.cover_image as PexelsPhoto).src.medium as string)
    : "";

  const excerpt = (await markdownExcerpt(article?.content || "")) + "...";

  return (
    <main className="w-full">
      <div>
        <section className="w-full bg-muted-100 dark:bg-muted-900">
          <div className="w-full max-w-7xl mx-auto">
            <div className="py-14 px-4 relative">
              <div className="mt-12 w-full mx-auto grid md:grid-cols-2">
                <div
                  className="
              bg-cover bg-center
              w-full
              mb-5
              md:mb-0
              ptablet:px-5
              ltablet:px-4
            "
                >
                  <Image
                    className="h-full w-full max-w-lg mx-auto object-cover rounded-3xl"
                    src={coverImage}
                    alt="Featured image"
                    width="512"
                    height="353"
                  />
                </div>

                <div className="h-full flex items-center ptablet:px-4 ltablet:px-6">
                  <div className="w-full max-w-lg">
                    <span
                      className="
                  inline-block
                  font-sans
                  text-xs
                  py-1.5
                  px-3
                  mb-4
                  rounded-lg
                  bg-primary-100
                  text-primary-500
                  dark:bg-primary-500 dark:text-white
                "
                    >
                      Business
                    </span>
                    <h1
                      className="
                  font-heading
                  text-muted-800
                  dark:text-white
                  font-extrabold
                  text-3xl
                  ltablet:text-4xl
                  lg:text-4xl
                "
                    >
                      {article?.title}
                    </h1>
                    <p
                      className="
                  font-sans
                  text-base text-muted-500
                  dark:text-muted-400
                  max-w-md
                  my-4
                "
                    >
                      {excerpt}
                    </p>
                    <div className="flex items-center justify-start w-full relative">
                      <img
                        className="w-12 mask mask-blob"
                        src="/img/avatars/36.jpg"
                        alt="avatar"
                        width="48"
                        height="48"
                      />
                      <div className="pl-2">
                        <h3
                          className="
                      font-heading font-medium
                      text-muted-800
                      dark:text-muted-50
                    "
                        >
                          Eliza Perez
                        </h3>
                        <p className="font-sans text-sm text-muted-400">
                          {article?.published_at?.toLocaleString()}
                        </p>
                      </div>
                      <div className="block ml-auto font-sans text-sm text-muted-400">
                        <span>— 5 min read</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 px-4 bg-white dark:bg-muted-900 overflow-hidden">
          <div className="w-full max-w-7xl mx-auto">
            <div className="w-full flex flex-col ltablet:flex-row lg:flex-row gap-y-8">
              <div className="w-full ptablet:w-3/4 ltablet:w-2/3 lg:w-3/4 ptablet:mx-auto">
                <div className="w-full md:px-10 text-xl text-muted-800 leading-normal">
                  <div className="space-y-4 mb-5">
                    <Link
                      href={"/"}
                      className="
                          flex
                          items-center
                          gap-2
                          w-24
                          h-5
                          rounded
                          placeload
                          animate-placeload
                        "
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        role="img"
                        width="1em"
                        height="1em"
                        viewBox="0 0 24 24"
                        data-icon="gg:arrow-long-left"
                        className="iconify w-5 h-5 iconify--gg"
                      >
                        <path
                          fill="currentColor"
                          d="m1.027 11.993l4.235 4.25L6.68 14.83l-1.821-1.828L22.974 13v-2l-18.12.002L6.69 9.174L5.277 7.757l-4.25 4.236Z"
                        ></path>
                      </svg>
                      <span>Back to Blog</span>
                    </Link>
                    <div className="w-96 h-6 rounded placeload animate-placeload"></div>
                    <div className="w-52 h-5 rounded placeload animate-placeload"></div>
                  </div>

                  <article
                    className="prose dark:prose-dark lg:prose-lg py-6"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                  <hr />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default page;
