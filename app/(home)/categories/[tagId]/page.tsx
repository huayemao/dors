import PostTile from "@/components/PostTile";
import { getArticles, getProcessedArticles } from "@/lib/posts";
import { PaginateOptions } from "@/lib/paginator";
import { getTags } from "@/lib/tags";

type SearchParams = PaginateOptions;
type Posts = Awaited<ReturnType<typeof getProcessedArticles>>;

export const revalidate = 300;
//https://beta.nextjs.org/docs/data-fetching/fetching#segment-cache-configuration

export default async function Home({
  searchParams,
  params,
}: {
  searchParams: SearchParams;
  params: {
    tagId: string;
  };
}) {
  const posts = await getProcessedArticles(
    await getArticles({ ...searchParams, tagId: Number(params.tagId) })
  );

  return <Posts data={posts} />;
}

function Posts({ data }: { data: Posts }) {
  return (
    <div className="flex flex-col gap-12 py-12">
      <div className="grid ptablet:grid-cols-2 ltablet:grid-cols-3 lg:grid-cols-3 gap-6 -m-3">
        {data.map((e) => (
          /* @ts-ignore */
          <PostTile post={e} url={e.url} key={e.id} />
        ))}
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const tags = await getTags();
  const params = tags.map((tag) => ({
    id: String(tag.id),
  }));
  return params;
}
