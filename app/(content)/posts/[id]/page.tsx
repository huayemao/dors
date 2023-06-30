import { BackButton } from "@/components/BackButton";
import MDXRemoteWrapper from "@/components/MDXRemoteWrapper";
import PostHead from "@/components/PostHead";
import PostTile from "@/components/PostTile";
import { ShareButton } from "@/components/ShareButton";
import { SITE_META } from "@/constants";
import { getArticle, getArticles } from "@/lib/articles";
import { parseMDX } from "@/lib/parseMDX";
import { PexelsPhoto } from "@/lib/types/PexelsPhoto";
import { getBase64Image, markdownExcerpt } from "@/lib/utils";
import huayemao from "@/public/img/huayemao.svg";
import { Metadata } from "next";
import { join } from "path";

export const revalidate = 300;

export async function generateStaticParams() {
  const articles = await getArticles();
  const params = articles.map((article) => ({
    id: String(article.id),
  }));
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  // read route params
  const id = params.id;
  const article = await getArticle(parseInt(id as string));

  return {
    title: `${article.title} | ${SITE_META.name}——${SITE_META.description}`,
    openGraph: {
      images: [(article.cover_image as PexelsPhoto).src.small],
    },
  };
}

export default async function page({ params }) {
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

  const mdxSource = await parseMDX(article);

  const coverImage = article?.cover_image
    ? (article.cover_image as PexelsPhoto).src.large
    : "";

  const url = await getBase64Image(coverImage);

  const excerpt = (await markdownExcerpt(article?.content || "")) + "...";

  return (
    <main className="w-full">
      <div>
        <PostHead
          article={{ ...article, excerpt }}
          avatar={{ alt: "花野猫", src: huayemao }}
          url={url}
        />
        <section className="w-full py-12 px-4 bg-white dark:bg-muted-900 overflow-hidden">
          <div className="w-full max-w-7xl mx-auto">
            <div className="w-full flex flex-col ltablet:flex-row lg:flex-row gap-y-8">
              <div className="w-full ptablet:w-3/4 ltablet:w-2/3 lg:w-3/4 ptablet:mx-auto">
                <div className="w-full md:px-10 text-xl text-muted-800 leading-normal">
                  <div className="space-y-4 mb-5">
                    <BackButton />
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
                      className="font-heading text-muted-800 dark:text-white font-semibold text-xl mb-6
          "
                    >
                      分享文章
                    </h3>

                    <div className="flex gap-4">
                      <ShareButton
                        options={{
                          title: article.title,
                        }}
                      />
                      <button
                        className="flex-1 inline-flex justify-center items-center py-4 px-5 rounded bg-muted-200 dark:bg-muted-700 hover:bg-muted-100 dark:hover:bg-muted-600 text-muted-600 dark:text-muted-400 transition-colors duration-300 cursor-pointer tw-accessibility
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

                  <h3 className="font-heading text-muted-800 dark:text-white font-semibold text-xl mb-6">
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
    </main>
  );
}
