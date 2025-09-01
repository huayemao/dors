import { CategoriesSwiper } from "@/components/CategoriesSwiper";
import { SITE_META } from "@/constants";
import { PaginateOptions } from "@/lib/paginator";
import {
  getPageCount,
  getPosts,
  getProcessedPosts,
  getRecentPosts,
} from "@/lib/server/posts";
import {
  BaseButton,
  BaseButtonAction,
  BaseHeading,
  BaseIconBox,
} from "@glint-ui/react";
import Icon from "@/components/Base/Icon";
import Link from "next/link";
import { cache, Fragment, Suspense } from "react";
import { GuideButton } from "@/app/(home)/PopoverButton";
import { Posts } from "@/components/Tiles/Posts";
import { MoveRight, MoveRightIcon } from "lucide-react";

type SearchParams = PaginateOptions;
type Posts = Awaited<ReturnType<typeof getProcessedPosts>>;

export const revalidate = 1200;

//https://beta.nextjs.org/docs/data-fetching/fetching#segment-cache-configuration

export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const posts = await getRecentPosts();

  const key = posts.map((e) => e.id).join();

  return (
    <Fragment key={key}>
      <section className="w-full bg-muted-100 h-screen min-h-screen dark:bg-muted-900">
        <div className="w-full max-w-7xl mx-auto">
          <div className="w-full h-screen min-h-screen flex items-center overflow-hidden">
            <div className="w-full h-full flex flex-col justify-between px-6">
              {/*Hero content*/}
              <div className="relative top-6 w-full h-full flex flex-col ltablet:flex-row lg:flex-row items-center pt-20 ltablet:pt-0 lg:pt-0 md:-m-3">
                {/*Column*/}
                <div className="w-full ltablet:w-1/2 lg:w-1/2 p-6">
                  <div className="max-w-md space-y-4 text-center mx-auto ltablet:text-left lg:text-left ltablet:mx-0 lg:mx-0">
                    <h1 className="font-heading font-bold text-5xl md:text-6xl text-muted-800 dark:text-white">
                      {SITE_META.name} {SITE_META.description}
                    </h1>
                    <p className="font-sans text-lg text-muted-500 dark:text-muted-400">
                      {SITE_META.introduction}
                    </p>

                    <div className="flex items-center justify-center ltablet:justify-start lg:justify-start gap-x-2">
                      <GuideButton />
                      <BaseButton
                        shadow="hover"
                        rounded="lg"
                        href="/posts/127"
                        size="lg"
                      >
                        阅读更多
                      </BaseButton>
                    </div>
                  </div>
                </div>

                {/*Column*/}
                <div className="w-full ltablet:w-1/2 lg:w-1/2 p-6">
                  {/*Content*/}
                  <div className="relative w-full max-w-[500px] h-[380px] ltablet:h-80 lg:h-80 mx-auto">
                    <div className="h-full w-full bg-primary-100 dark:bg-primary-500/20"></div>
                    <img
                      src="/img/house_with_garden_color.svg"
                      className="block absolute bottom-0 inset-x-0 mx-auto object-contain max-w-[320px]"
                      alt="house_with_garden_color emoji"
                      width="228"
                      height="368"
                    ></img>
                    {/*Floating-card left*/}
                    {/* <div className="hidden md:block absolute -bottom-12 -left-12 bg-white dark:bg-muted-800 border border-muted-200 dark:border-muted-700 rounded-xl p-6 shadow-xl shadow-muted-400/10 dark:shadow-muted-800/10">
                      <div className="flex justify-between mb-4">
                        <h3 className="font-heading font-semibold text-muted-800 dark:text-muted-100">
                          Top 5%
                        </h3>
                        <span className="font-sans text-sm text-muted-400">
                          3 new
                        </span>
                      </div>
                      <div className="flex justify-between items-center gap-4"></div>
                    </div> */}

                    {/*Floating-card right*/}
                    <div className="hidden md:block absolute -top-12 ptablet:-top-6 -right-24 bg-white dark:bg-muted-800 border border-muted-200 dark:border-muted-700 rounded-xl p-5 shadow-xl shadow-muted-400/10 dark:shadow-muted-800/10">
                      <div className="flex items-center gap-2 mb-2"></div>
                      <p className="font-sans text-sm text-muted-400 max-w-[220px] leading-tight mb-2">
                        随笔作为种子，博客作为花坛，知识库作为果园
                      </p>
                      <div className="flex items-center gap-2">
                        <img
                          className="object-cover w-8 h-8 mask mask-blob"
                          src="/img/huayemao.svg"
                          alt="Avatar"
                        />
                        <div>
                          <h5 className="font-heading font-semibold text-xs text-muted-800 dark:text-muted-100">
                            花野猫
                          </h5>
                          <p className="font-sans text-xs text-muted-400">
                            数字花园践行者
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12 px-4 bg-white dark:bg-muted-900 overflow-hidden">
        {/* 分类轮播导航 */}
        <div className=" w-full max-w-5xl mx-auto  space-y-4 py-6">
          <div className="w-full max-w-2xl mx-auto text-center space-y-4 py-6">
            {/*Badge*/}
            <span className="inline-block font-sans text-xs py-1.5 px-3 m-1 rounded-lg bg-primary-100 text-primary-500 dark:bg-primary-500 dark:text-white">
              花坛
            </span>
            <h2 className="font-heading font-bold text-4xl md:text-5xl text-muted-800 dark:text-white">
              博客
            </h2>
            {/*Subtitle*/}
            <p className="font-sans text-lg text-muted-500 dark:text-muted-400 text-balance">
              作者以探索为锄、热爱为种，悉心打理的灵感小天地。在这里，既有技术与工具的实用锋芒，也不乏人文与生活的柔软温度。
            </p>
          </div>
          <CategoriesSwiper />
          <div className="w-full max-w-5xl mx-auto py-6">
            <div className="grid ptablet:gap-8 ltablet:grid-cols-2 lg:grid-cols-2">
              {/*Column*/}
              <div className="w-full h-full flex flex-col gap-6 md:gap-0 justify-center">
                <div className="space-y-4">
                  {/*Title*/}
                  <h2 className="font-heading font-bold text-4xl text-muted-800 dark:text-white">
                    最近更新的文章
                  </h2>
                  {/*Subtitle*/}
                  <p className="font-sans text-lg text-muted-500 dark:text-muted-400">
                    最新的文章列表，涵盖技术、生活、读书等多个领域，分享作者的见解与经验。
                  </p>
                  {/*Link*/}
                  <a href="#" className="group inline-flex items-center gap-4 text-primary-500 hover:text-primary-400 transition-colors duration-300">
                    <span className="font-sans font-medium text-sm">
                      查看全部文章
                    </span>
                    <MoveRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"></MoveRightIcon>
                  </a>
                </div>
              </div>
              {/*Column*/}
              <div className="bg-muted-100 dark:bg-muted-800 rounded-lg px-6 my-6">
                <Posts data={posts} mini singlColumn />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
}
