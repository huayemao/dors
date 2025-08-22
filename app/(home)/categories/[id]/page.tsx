import { Posts } from "@/components/Tiles/Posts";
import { getAllCategories } from "@/lib/server/categories";
import { PaginateOptions } from "@/lib/paginator";
import { getPosts, getProcessedPosts } from "@/lib/server/posts";
import { Metadata } from "next";
import { SITE_META } from "@/constants";
import { BaseHeading } from "@shuriken-ui/react";

type SearchParams = PaginateOptions;
type Posts = Awaited<ReturnType<typeof getProcessedPosts>>;

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  // read route params

  const cats = await getAllCategories({ includeHidden: true });
  const cat = cats.find((e) => e.id == parseInt(params.id))!;

  const keywords = [cat.name!];
  // @ts-ignore
  const desc = cat?.meta?.description || "";

  return {
    title: `${cat?.name} —— 分类 | ${SITE_META.name}`,
    description: desc,
    abstract: desc,
    keywords,
  };
}

export const revalidate = 3600;
//https://beta.nextjs.org/docs/data-fetching/fetching#segment-cache-configuration

export default async function PostsByCategory({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const cats = await getAllCategories({ includeHidden: true });
  const cat = cats.find((e) => e.id == parseInt(params.id))!;
  const posts = await getProcessedPosts(
    await getPosts({
      includeHiddenCategories: true,
      categoryId: Number(params.id),
      perPage: 600,
      protected: false,
    }),
    { imageSize: "small" }
  );
  return (
    <div className="container">
      <div>
        <BaseHeading
          as="h1"
          size="3xl"
          className="font-heading text-muted-900 dark:text-white"
        >
          {cat.name}
        </BaseHeading>
        <p className="mt-1 text-sm text-muted-600 dark:text-muted-400">
          {/* @ts-ignore */}
          {cat.meta?.description}
        </p>
      </div>
      <Posts mini data={posts} />
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
