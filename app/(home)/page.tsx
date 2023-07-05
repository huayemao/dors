import { Pagination } from "@/components/Pagination";
import { Posts } from "@/components/Posts";
import { PaginateOptions } from "@/lib/paginator";
import { getPageCount, getPosts, getProcessedPosts } from "@/lib/posts";

type SearchParams = PaginateOptions;
type Posts = Awaited<ReturnType<typeof getProcessedPosts>>;

export const revalidate = 300;
//https://beta.nextjs.org/docs/data-fetching/fetching#segment-cache-configuration

export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const posts = await getProcessedPosts(await getPosts(searchParams));
  const pageCount = await getPageCount();

  return (
    <>
      <Posts showFeature data={posts} />
      <Pagination pageCount={pageCount} buildHref={(e) => `/p/${e}`} />
    </>
  );
}
