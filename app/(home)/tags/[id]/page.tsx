import { Posts } from "@/components/Posts";
import { PaginateOptions } from "@/lib/paginator";
import { getPosts, getProcessedPosts } from "@/lib/server/posts";
import { getTagIds } from "@/lib/server/tags";

type SearchParams = PaginateOptions;
type Posts = Awaited<ReturnType<typeof getProcessedPosts>>;

export const revalidate = 3600;
//https://beta.nextjs.org/docs/data-fetching/fetching#segment-cache-configuration

export default async function PostsByTag({
  searchParams,
  params,
}: {
  searchParams: SearchParams;
  params: {
    id: string;
  };
}) {
  const posts = await getProcessedPosts(
    await getPosts({ perPage: 200, ...searchParams, tagId: Number(params.id) })
  );

  return <Posts data={posts} />;
}

export async function generateStaticParams() {
  const tags = (await getTagIds()).slice(0, 5);
  const params = tags.map((tag) => ({
    id: String(tag.id),
  }));
  return params;
}
