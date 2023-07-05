import { Posts } from "@/components/Posts";
import { PaginateOptions } from "@/lib/paginator";
import { getPosts, getProcessedPosts } from "@/lib/posts";

type SearchParams = PaginateOptions;
export default async function UnCategorizedPosts({
  searchParams,
  params,
}: {
  searchParams: SearchParams;
  params: {
    id: string;
  };
}) {
  const posts = await getProcessedPosts(
    await getPosts({ ...searchParams, unCategorized: true })
  );
  return <Posts data={posts} />;
}
