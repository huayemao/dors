import { Posts } from "@/components/Tiles/Posts";
import { PaginateOptions } from "@/lib/paginator";
import { getPosts, getProcessedPosts } from "@/lib/server/posts";
import { getTagById, getTagIds, getTags } from "@/lib/server/tags";
import { BaseHeading } from "@glint-ui/react";
import { Fragment } from "react/jsx-runtime";

type SearchParams = Promise<PaginateOptions>;
type Posts = Awaited<ReturnType<typeof getProcessedPosts>>;

export const revalidate = 3600;
//https://beta.nextjs.org/docs/data-fetching/fetching#segment-cache-configuration

export default async function PostsByTag(
  props: {
    searchParams: Promise<SearchParams>;
    params: Promise<{
      id: string;
    }>;
  }
) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const posts = await getProcessedPosts(
    await getPosts({ perPage: 200, ...searchParams, tagId: Number(params.id) })
  );

  const tag = await getTagById(Number(params.id));
  
  if (!tag) {
    throw new Error("Tag not found");
  }

  return <Fragment >
    <section className="px-4 py-16 min-h-screen bg-muted-100 dark:bg-muted-800">
      <div className="max-w-5xl mx-auto">
        <BaseHeading
          as="h1"
          size="3xl"
          className="font-heading text-muted-900 dark:text-white"
        >
          {tag.name}
        </BaseHeading>
        <p className="mt-1 text-sm text-muted-600 dark:text-muted-400">
          共有 {posts.length} 篇带有{tag.name}标签的文章
        </p>
        <div className="space-y-4">
          <Posts data={posts} mini />
        </div>
      </div>
    </section>
  </Fragment>;
}

export async function generateStaticParams() {
  const tags = (await getTagIds()).slice(0, 5);
  const params = tags.map((tag) => ({
    id: String(tag.id),
  }));
  return params;
}
