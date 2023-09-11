import { Posts } from "@/components/Posts";
import { getAllCategories } from "@/lib/categories";
import { PaginateOptions } from "@/lib/paginator";
import { getPosts, getProcessedPosts } from "@/lib/posts";

type SearchParams = PaginateOptions;
type Posts = Awaited<ReturnType<typeof getProcessedPosts>>;

export const revalidate = 600;
//https://beta.nextjs.org/docs/data-fetching/fetching#segment-cache-configuration

export default async function PostsByCategory({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const posts = await getProcessedPosts(
    await getPosts({ categoryId: Number(params.id), perPage: 600 }),
    { imageSize: "small" }
  );
  return <Posts mini data={posts} />;
}

export async function generateStaticParams() {
  const cats = await getAllCategories();
  const params = cats.map((cat) => ({
    id: String(cat.id),
  }));
  return params;
}
