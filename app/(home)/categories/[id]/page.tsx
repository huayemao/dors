import { Posts } from "@/components/Posts";
import { getAllCategories } from "@/lib/server/categories";
import { PaginateOptions } from "@/lib/paginator";
import { getPosts, getProcessedPosts } from "@/lib/posts";
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

  const cats = await getAllCategories();
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
  const cats = await getAllCategories();
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
    <>
      <BaseHeading size="3xl" className="text-center" as="h2">
        分类——{cat.name}
      </BaseHeading>
      <p className="text-center font-sans text-base md:text-lg text-muted-500 dark:text-muted-400">
        {/* @ts-ignore */}
        {cat.meta?.description}
      </p>
      <Posts mini data={posts} />
    </>
  );
}

export async function generateStaticParams() {
  const cats = await getAllCategories();
  const params = cats.map((cat) => ({
    id: String(cat.id),
  }));
  return params;
}
