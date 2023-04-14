import { getArticle, getArticles } from "@/lib/articles";
import { join } from "path";
import { markdownExcerpt, markdownToHtml } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { getBase64Image } from "@/lib/getBase64Image";
import { PexelsPhoto } from "@/lib/types/PexelsPhoto";
import { serialize } from "next-mdx-remote/serialize";
import remarkShikiTwoslash from "remark-shiki-twoslash";
import rehypeRaw from "rehype-raw";
import MDXRemoteWrapper from "@/components/MDXRemoteWrapper";
import { languages } from "@/lib/shiki";
import Tag from "@/components/Tag";
const theme = require("shiki/themes/nord.json");

export const revalidate = 600;

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((article) => ({
    id: article.id,
  }));
}

async function page({ params }) {
  if (!params.id) {
    return;
  }

  const article = await getArticle(parseInt(params.id as string));

  let articles = (await getArticles()).slice(0, 5);
  articles = await Promise.all(
    articles.map(async (e) => ({
      ...e,
      url: await getBase64Image((e.cover_image as PexelsPhoto).src.small),
    }))
  );

  const tmpDir = join(process.cwd(), "tmp");
  console.log(tmpDir);

  const mdxSource = await serialize(article?.content || "", {
    mdxOptions: {
      rehypePlugins: [rehypeRaw],
      remarkPlugins: [
        [
          remarkShikiTwoslash,
          {
            theme,
            langs: languages,
          },
        ],
      ], // 添加 Shiki 插件来呈现代码块高亮
      format: "mdx",
    },
  });

  const coverImage = article?.cover_image
    ? (article.cover_image as PexelsPhoto).src.large
    : "";

  const url = await getBase64Image(coverImage);

  const excerpt = (await markdownExcerpt(article?.content || "")) + "...";

  return (
    <main className="w-full">
      <div>
        <section className="w-full bg-muted-100 dark:bg-muted-900">
          <div className="w-full max-w-7xl mx-auto">
            <div className="py-14 px-4 relative">
              <div className="mt-12 w-full mx-auto grid md:grid-cols-2 gap-2">
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
                    src={url}
                    alt="Featured image"
                    width="512"
                    height="353"
                  />
                </div>

                <div className="h-full flex items-center ptablet:px-4 ltablet:px-6">
                  <div className="w-full max-w-lg space-x-2">
                    {!!article?.tags?.length &&
                      article.tags.map(
                        (t) =>
                          t && (
                            <Tag
                              key={t.id}
                              type="secondary"
                              text={t.name as string}
                            />
                          )
                      )}

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
                      <div className="bg-rose-50 mask flex items-center justify-center mask-blob w-12 h-12 text-[36px]">
                        🐈
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
                          {article?.published_at?.toLocaleString("zh-cn")}
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
                      className="flex items-center gap-2 font-sans font-medium text-base text-muted-400 hover:text-primary-500 transition-colors duration-300"
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
                  </div>
                  <article className="prose dark:prose-dark lg:prose-xl py-6">
                    <MDXRemoteWrapper {...mdxSource} />
                  </article>
                </div>
              </div>
              <div className="w-full ptablet:w-3/4 ltablet:w-1/3 lg:w-1/4 ptablet:mx-auto">
                <div className="mt-10">
                  <div>
                    <h3
                      className="
            font-heading
            text-muted-800
            dark:text-white
            font-semibold
            text-xl
            mb-6
          "
                    >
                      Share this post
                    </h3>

                    <div className="flex gap-4">
                      <button
                        className="
              flex-1
              inline-flex
              justify-center
              items-center
              py-4
              px-5
              rounded
              bg-muted-200
              dark:bg-muted-700
              hover:bg-muted-100
              dark:hover:bg-muted-600
              text-muted-600
              dark:text-muted-400
              transition-colors
              duration-300
              cursor-pointer
              tw-accessibility
            "
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          role="img"
                          width="0.63em"
                          height="1em"
                          viewBox="0 0 320 512"
                          data-icon="fa6-brands:facebook-f"
                          className="iconify w-4 h-4 iconify--fa6-brands"
                        >
                          <path
                            fill="currentColor"
                            d="m279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"
                          ></path>
                        </svg>
                      </button>
                      <button
                        className="
              flex-1
              inline-flex
              justify-center
              items-center
              py-4
              px-5
              rounded
              bg-muted-200
              dark:bg-muted-700
              hover:bg-muted-100
              dark:hover:bg-muted-600
              text-muted-600
              dark:text-muted-400
              transition-colors
              duration-300
              cursor-pointer
              tw-accessibility
            "
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          role="img"
                          width="1em"
                          height="1em"
                          viewBox="0 0 512 512"
                          data-icon="fa6-brands:twitter"
                          className="iconify w-4 h-4 iconify--fa6-brands"
                        >
                          <path
                            fill="currentColor"
                            d="M459.37 151.716c.325 4.548.325 9.097.325 13.645c0 138.72-105.583 298.558-298.558 298.558c-59.452 0-114.68-17.219-161.137-47.106c8.447.974 16.568 1.299 25.34 1.299c49.055 0 94.213-16.568 130.274-44.832c-46.132-.975-84.792-31.188-98.112-72.772c6.498.974 12.995 1.624 19.818 1.624c9.421 0 18.843-1.3 27.614-3.573c-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319c-28.264-18.843-46.781-51.005-46.781-87.391c0-19.492 5.197-37.36 14.294-52.954c51.655 63.675 129.3 105.258 216.365 109.807c-1.624-7.797-2.599-15.918-2.599-24.04c0-57.828 46.782-104.934 104.934-104.934c30.213 0 57.502 12.67 76.67 33.137c23.715-4.548 46.456-13.32 66.599-25.34c-7.798 24.366-24.366 44.833-46.132 57.827c21.117-2.273 41.584-8.122 60.426-16.243c-14.292 20.791-32.161 39.308-52.628 54.253z"
                          ></path>
                        </svg>
                      </button>
                      <button
                        className="
              flex-1
              inline-flex
              justify-center
              items-center
              py-4
              px-5
              rounded
              bg-muted-200
              dark:bg-muted-700
              hover:bg-muted-100
              dark:hover:bg-muted-600
              text-muted-600
              dark:text-muted-400
              transition-colors
              duration-300
              cursor-pointer
              tw-accessibility
            "
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          role="img"
                          width="0.88em"
                          height="1em"
                          viewBox="0 0 448 512"
                          data-icon="fa6-brands:linkedin-in"
                          className="iconify w-4 h-4 iconify--fa6-brands"
                        >
                          <path
                            fill="currentColor"
                            d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2c-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3c94 0 111.28 61.9 111.28 142.3V448z"
                          ></path>
                        </svg>
                      </button>
                      <button
                        className="
              flex-1
              inline-flex
              justify-center
              items-center
              py-4
              px-5
              rounded
              bg-muted-200
              dark:bg-muted-700
              hover:bg-muted-100
              dark:hover:bg-muted-600
              text-muted-600
              dark:text-muted-400
              transition-colors
              duration-300
              cursor-pointer
              tw-accessibility
            "
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          role="img"
                          width="1em"
                          height="1em"
                          viewBox="0 0 512 512"
                          data-icon="fa6-solid:envelope"
                          className="iconify w-4 h-4 iconify--fa6-solid"
                        >
                          <path
                            fill="currentColor"
                            d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4l217.6 163.2c11.4 8.5 27 8.5 38.4 0l217.6-163.2c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176v208c0 35.3 28.7 64 64 64h384c35.3 0 64-28.7 64-64V176L294.4 339.2a63.9 63.9 0 0 1-76.8 0L0 176z"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <hr className="my-10 border-t border-muted-200 dark:border-muted-800" />

                  <h3
                    className="
            font-heading
            text-muted-800
            dark:text-white
            font-semibold
            text-xl
            mb-6
          "
                  >
                    Recent posts
                  </h3>

                  <ul className="space-y-6">
                    {articles.map((e) => (
                      <li key={e.id}>
                        <a href="#" className="flex items-center">
                          <div className="relative flex justify-start gap-2 w-full">
                            <img
                              className="h-12 w-12 mask mask-blob object-cover"
                              /* @ts-ignore */
                              src={e.url}
                              alt="Post image"
                              width="48"
                              height="48"
                            />
                            <div>
                              <h3
                                className="
                      font-heading font-medium
                      text-muted-800
                      dark:text-muted-50
                      leading-snug
                      overflow-hidden
                      text-ellipsis
                      max-w-3/4
                      line-clamp-2
                      mb-1
                    "
                              >
                                {e.title}
                              </h3>
                              <p className="font-sans text-sm text-muted-400">
                                {e.updated_at?.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
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
