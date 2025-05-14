import { CatsAndTags } from "@/components/CatsAndTags";
import { Posts } from "@/components/Tiles/Posts";
import { Books, BookSummary } from "@/components/Tiles/Books";
import { SITE_META } from "@/constants";
import { PaginateOptions } from "@/lib/paginator";
import { getPageCount, getPosts, getProcessedPosts } from "@/lib/server/posts";
import { BaseHeading, BaseIconBox } from "@shuriken-ui/react";
import { NotebookIcon } from "lucide-react";
import Icon from "@/components/Base/Icon";
import Link from "next/link";
import { cache, Fragment, Suspense } from "react";
import { getResourceItems } from "@/lib/server/resource";
import { Application } from "@/components/Application";

type SearchParams = PaginateOptions;
type Posts = Awaited<ReturnType<typeof getProcessedPosts>>;

export const revalidate = 1200;

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

  const books = await getPosts({ 
    type: "book",
    includeHiddenCategories: true 
  }) as BookSummary[];

  const resourceItems = await getResourceItems();

  const key = posts.map((e) => e.id).join();
  const apps = [
    {
      name: "小记",
      href: "/notes",
      iconName: "notebook",
    },
    {
      name: "自留地",
      href: "/protected",
      iconName: "globe-lock",
    },
    {
      name: "后台",
      href: "/admin",
      iconName: "cog",
    },
  ].concat(
    resourceItems.map((e) => ({
      name: e.title,
      href: e.url,
      iconName: e.iconName || "link",
    }))
  );
  return (
    <Fragment key={key}>
      <h1 className="font-heading leading-normal font-extrabold text-5xl md:text-5xl text-muted-700 dark:text-white text-center  mb-4">
        {SITE_META.name + " " + SITE_META.description}
      </h1>
      <p className="text-center font-sans text-base md:text-lg text-muted-500 dark:text-muted-400">
        {SITE_META.introduction}
      </p>
      <CatsAndTags simple></CatsAndTags>
      <div className="space-y-8">
          <Books data={books}/>
        <div className="space-y-4">
          <BaseHeading size="3xl" className="text-center" as="h2">
            文章列表
          </BaseHeading>
          <Posts data={posts} />
        </div>
      </div>
    </Fragment>
  );
}


