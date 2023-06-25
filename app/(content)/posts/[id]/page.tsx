import MDXRemoteWrapper from "@/components/MDXRemoteWrapper";
import PostTile from "@/components/PostTile";
import Tag from "@/components/Tag";
import { getArticle, getArticles } from "@/lib/articles";
import { getBase64Image } from "@/lib/getBase64Image";
import { languages } from "@/lib/shiki";
import { PexelsPhoto } from "@/lib/types/PexelsPhoto";
import { markdownExcerpt } from "@/lib/utils";
import { Metadata } from "next";
import { serialize } from "next-mdx-remote/serialize";
import Image from "next/image";
import Link from "next/link";
import { join } from "path";
import { Suspense } from "react";
import rehypeRaw from "rehype-raw";
import remarkShikiTwoslash from "remark-shiki-twoslash";
import { ShareButton } from "../../../../components/ShareButton";
import Loading from "./loading";
const theme = require("shiki/themes/nord.json");

export const revalidate = 600;

export async function generateStaticParams() {
  const articles = await getArticles();
  const ids = articles.map((article) => ({
    id: String(article.id),
  }));
  return ids;
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  // read route params
  const id = params.id;
  const article = await getArticle(parseInt(params.id as string));

  return {
    title: article.title,
    openGraph: {
      images: [(article.cover_image as PexelsPhoto).src.small],
    },
  };
}

async function page({ params }) {
  if (!params.id) {
    return;
  }

  const article = await getArticle(parseInt(params.id as string));

  let articles = await getArticles({ perPage: 5 });
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
      <Suspense fallback={<Loading></Loading>}>
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
                        <span>返回</span>
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
                        <ShareButton
                          options={{
                            title: article.title,
                          }}
                        ></ShareButton>

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
                      最近文章 
                    </h3>

                    <ul className="space-y-6">
                      {articles.map((e) => (
                        <PostTile
                          key={e.id}
                          type="mini"
                          article={e}
                          /* @ts-ignore */
                          url={e.url}
                        />
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </Suspense>
    </main>
  );
}

export default page;
