import { Books, BookSummary } from "@/components/Tiles/Books";
import { SITE_META } from "@/constants";
import { PaginateOptions } from "@/lib/paginator";
import { getPageCount, getPosts, getProcessedPosts } from "@/lib/server/posts";
import { BaseHeading, BaseIconBox } from "@glint-ui/react";

import { cache, Fragment, Suspense } from "react";

type SearchParams = PaginateOptions;

export const revalidate = 1200;

export const metadata = {
  title: '知识库（果园）',
  description: '果园便沉淀着花野猫先生在数字花园中耕耘的硕果。这里是知识收纳地，博主将零散认知、实用技能、深度思考 “栽种” 成果树，经时间打磨褪去杂乱，留下扎实养分。访客无需在信息中寻觅，抬手便能采摘解决问题、充盈认知的 “果实”。',
  keywords: ['数字花园', '知识库', '知识管理', '知识分享','对抗浅薄'],
};

//https://beta.nextjs.org/docs/data-fetching/fetching#segment-cache-configuration

export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const posts = await getProcessedPosts(
    await getPosts({
      ...searchParams,
      protected: false,
      type: "normal",
    })
  );

  const books = (await getPosts({
    type: "book",
    includeHiddenCategories: true,
  })) as BookSummary[];

  const key = posts.map((e) => e.id).join();

  return (
    <Fragment key={key}>
      <section className="px-4 py-16 bg-muted-100 dark:bg-muted-800">
        <div className="max-w-5xl mx-auto">
          <BaseHeading
            as="h1"
            size="3xl"
            className="font-heading text-muted-900 dark:text-white"
          >
            知识库（果园）
          </BaseHeading>
          <p className="mt-1 text-sm text-muted-600 dark:text-muted-400">
            {SITE_META.introduction}
          </p>
          <div className="my-8 space-y-4">
            <Books data={books} />
          </div>
        </div>
      </section>
    </Fragment>
  );
}
