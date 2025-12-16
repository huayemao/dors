import { CategoriesSwiper } from "@/components/CategoriesSwiper";
import { SectionContainer } from "@/components/SectionContainer";
import { SITE_META } from "@/constants";
import { PaginateOptions } from "@/lib/paginator";
import {
  getPageCount,
  getPosts,
  getProcessedPosts,
  getRecentPosts,
} from "@/lib/server/posts";
import { getActivityCards } from "@/lib/server/activityCards";
import {
  BaseButton,
  BaseButtonAction,
  BaseCard,
  BaseHeading,
  BaseIconBox,
} from "@glint-ui/react";

import { cache, Fragment, Suspense } from "react";
import { GuideButton } from "@/app/(home)/PopoverButton";
import { Posts } from "@/components/Tiles/Posts";
import { MoveRight, MoveRightIcon } from "lucide-react";
import ActivityCard from "@/components/ActivityCard";
import { BookSwiper } from "../../components/BookSwiper";
import Prose from "@/components/Base/Prose";
import NavList from "@/lib/mdx/NavList";


type SearchParams = Promise<PaginateOptions>;
type Posts = Awaited<ReturnType<typeof getProcessedPosts>>;

export const revalidate = 1200;

//https://beta.nextjs.org/docs/data-fetching/fetching#segment-cache-configuration

export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const posts = await getRecentPosts();
  const activityCards = await getActivityCards();
  const books = await getPosts({ type: "book" });

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
                      {SITE_META.name}
                    </h1>
                    <p className="font-sans text-lg text-muted-500 dark:text-muted-400">
                      {SITE_META.description} —— {SITE_META.introduction}
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
                    <BaseCard className="p-6 h-full" shadow="flat">
                      <Prose content={`
                    ### 常用资源
                    <NavList>
                          + [国内互联网平台搜索页链接清单](/posts/414 "践行无头访问法")
                          </NavList>`} />
                    </BaseCard>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <SectionContainer
        badge="博客"
        title="花坛"
        subtitle="作者以探索为锄、热爱为种，悉心打理的灵感小天地。在这里，既有技术与工具的实用锋芒，也不乏人文与生活的柔软温度。"
      >
        {/* 分类轮播导航 */}
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
                <a
                  href="/posts"
                  className="group inline-flex items-center gap-4 text-primary-500 hover:text-primary-400 transition-colors duration-300"
                >
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
      </SectionContainer>
      <SectionContainer
        badge="最常使用"
        title="常青圃"
        subtitle="无论季节更迭，这里永远孕育着最新的收获。"
      >
        <div className="space-y-6 lg:pb-20">
          {activityCards.length > 0 ? (
            activityCards.map((card, index) => (
              <ActivityCard
                key={card.id}
                title={card.title}
                imgUrl={card.imgUrl || ''}
                description={card.description}
                href={card.href}
                actionName={card.actionName}
              />
            ))
          ) : null}
        </div>
      </SectionContainer>
      <SectionContainer
        badge="知识库"
        title="知识库"
        subtitle="作者精心整理的知识体系，涵盖技术、工具、读书等多个领域。"
      >
        <div className="w-full max-w-7xl mx-auto py-6 relative">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="font-heading font-bold text-4xl text-muted-800 dark:text-white">
                精选知识库
              </h2>
              <p className="font-sans text-lg text-muted-500 dark:text-muted-400">
                探索作者的知识体系，获取有价值的信息和见解。
              </p>
            </div>
            <a
              href="/books"
              className="group inline-flex items-center gap-4 text-primary-500 hover:text-primary-400 transition-colors duration-300"
            >
              <span className="font-sans font-medium text-sm">
                查看全部知识库
              </span>
              <MoveRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"></MoveRightIcon>
            </a>
          </div>
          <BookSwiper books={books} />
        </div>
      </SectionContainer>
    </Fragment>
  );
}


