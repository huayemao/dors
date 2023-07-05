import PostTile from "@/components/PostTile";
import { getAllCategories } from "@/lib/categories";
import { PaginateOptions } from "@/lib/paginator";
import { getPosts, getProcessedPosts } from "@/lib/posts";

type SearchParams = PaginateOptions;
type Posts = Awaited<ReturnType<typeof getProcessedPosts>>;

export const revalidate = 300;
//https://beta.nextjs.org/docs/data-fetching/fetching#segment-cache-configuration

export default async function Home({
  searchParams,
  params,
}: {
  searchParams: SearchParams;
  params: {
    id: string;
  };
}) {
  const posts = await getProcessedPosts(
    await getPosts({ ...searchParams, categoryId: Number(params.id) })
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
  const cats = await getAllCategories();
  const params = cats.map((cat) => ({
    id: String(cat.id),
  }));
  return params;
}
