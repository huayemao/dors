import Post from "@/components/Post";
import { getPost, getPostIds, getRelatedPosts } from "@/lib/server/posts";
import nextConfig from "@/next.config.mjs";
import { notFound, redirect } from "next/navigation";

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

  if (post.type.includes("collection")) {
    return redirect("/notes/" + params.id);
  }

  let posts = await getRelatedPosts(post);

  return (
    <main className="w-full">
      {/* @ts-ignore */}
      <Post data={post} relatedPosts={posts} />
    </main>
  );
}
