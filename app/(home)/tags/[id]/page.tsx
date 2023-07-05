import { Posts } from "@/components/Posts";
import { PaginateOptions } from "@/lib/paginator";
import { getPosts, getProcessedPosts } from "@/lib/posts";
import { getTags } from "@/lib/tags";

type SearchParams = PaginateOptions;
type Posts = Awaited<ReturnType<typeof getProcessedPosts>>;

export const revalidate = 300;
//https://beta.nextjs.org/docs/data-fetching/fetching#segment-cache-configuration

export default async function PostsByTag({
  searchParams,
  params,
}: {
  searchParams: SearchParams;
  params: {
    tagId: string;
  };
}) {
  const posts = await getProcessedPosts(
    await getPosts({ ...searchParams, tagId: Number(params.tagId) })
  );

  return <Posts data={posts} />;
}

export async function generateStaticParams() {
  const tags = await getTags();
  const params = tags.map((tag) => ({
    id: String(tag.id),
  }));
  return params;
}
