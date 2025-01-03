import Post from "@/components/Post";
import { getPost, getPostIds, getRecentPosts } from "@/lib/posts";
import nextConfig from "@/next.config.mjs";
import { notFound } from "next/navigation";

export const revalidate = 300;

export async function generateStaticParams() {
  const posts = await getPostIds({ protected: true });
  const allPostIds = posts.map((post) => ({
    id: String(post.id),
}));
  const params =
    nextConfig.output === "export" ? allPostIds : allPostIds.slice(0, 5);
  return params;
}

export default async function page({ params }) {
  if (!params.id) {
    return;
  }

  const id = parseInt(params.id as string);

  if (Number.isNaN(id)) {
    return notFound();
  }

  const post = await getPost(id);

  if (!post) {
    return notFound();
  }

  let posts = await getRecentPosts({ protected: true });


  return (
    <main className="w-full">
      {/* @ts-ignore */}
      <Post data={post} recentPosts={posts} />
    </main>
  );
}
