import Post from "@/components/Post";
import { SITE_META } from "@/constants";
import { getPost, getPostIds, getRecentPosts } from "@/lib/posts";
import { PexelsPhoto } from "@/lib/types/PexelsPhoto";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { join } from "path";

export const revalidate = 300;

export async function generateStaticParams() {
  const posts = await getPostIds();
  const params = posts
    .map((post) => ({
      id: String(post.id),
    }))
    .slice(0, 15);
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  // read route params
  const id = params.id;
  const post = await getPost(parseInt(id as string));

  if (!post) {
    return notFound();
  }

  return {
    title: `${post.title} | ${SITE_META.name}——${SITE_META.description}`,
    openGraph: {
      images: [(post.cover_image as PexelsPhoto).src.small],
    },
  };
}

export default async function page({ params }) {
  if (!params.id) {
    return;
  }

  const post = await getPost(parseInt(params.id as string));

  if (!post) {
    return notFound();
  }

  let posts = await getRecentPosts();

  const tmpDir = join(process.cwd(), "tmp");
  console.log(tmpDir);

  return (
    <main className="w-full">
      {/* @ts-ignore */}
      <Post data={post} recentPosts={posts} />
    </main>
  );
}

