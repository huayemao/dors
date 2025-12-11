import { Posts } from "@/components/Tiles/Posts";
import { getAllCategories } from "@/lib/server/categories";
import { getPosts, getProcessedPosts } from "@/lib/server/posts";
import { Metadata } from "next";
import { SITE_META } from "@/constants";
import { BaseHeading } from "@glint-ui/react";

type Posts = Awaited<ReturnType<typeof getProcessedPosts>>;

export async function generateMetadata(
  props: {
    params: Promise<{ id: string }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  // read route params

  const cats = await getAllCategories({ includeHidden: true });
  const cat = cats.find((e) => e.id == parseInt(params.id))!;

  const keywords = [cat.name!];
  // @ts-ignore
  const desc = cat?.meta?.description || "";

  return {
    title: `${cat?.name} —— 分类 | ${SITE_META.name} ${SITE_META.description}`,
    description: desc,
    abstract: desc,
    keywords,
  };
}

export const revalidate = 3600;
//https://beta.nextjs.org/docs/data-fetching/fetching#segment-cache-configuration

export default async function PostsByCategory(
  props: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  const params = await props.params;
  const cats = await getAllCategories({ includeHidden: true });
  const cat = cats.find((e) => e.id == parseInt(params.id))!;
  const posts = await getProcessedPosts(
    await getPosts({
      includeHiddenCategories: true,
      categoryId: Number(params.id),
      type: "normal",
      perPage: 600,
      protected: false,
    }),
    { imageSize: "small" }
  );
  return (
    <section className="px-4 py-16 bg-muted-100 dark:bg-muted-800">
      <div className="max-w-5xl mx-auto">
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
        <Posts mini data={posts} />
      </div>
    </section>
  );
}

export async function generateStaticParams() {
  const cats = await getAllCategories();
  const params = cats.map((cat) => ({
    id: String(cat.id),
  }));
  return params;
}
