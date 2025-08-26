import Prose from "@/components/Base/Prose";
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

  if (post.type == "page") {
    return (
      <>
        <section className="container mx-auto pt-16 px-6">
          <Prose content={post.content} className="max-w-full" />
        </section>
        {/* 这里只是为了能在 mdx 中动态使用这个  class ... */}
        <div className="lg:grid-cols-4"></div>
      </>
    );
  }

  let posts = await getRelatedPosts(post);

  return (
    <main className="w-full">
      {/* @ts-ignore */}
      <Post data={post} relatedPosts={posts} />
    </main>
  );
}
