import parseMDX from "@/lib/mdx/parseMDX";
import { getPost, getPostIds, getRelatedPosts } from "@/lib/server/posts";
import { notFound, redirect } from "next/navigation";

import Prose from "@/components/Base/Prose";
import { Footer } from "@/components/Footer";
import Post from "@/components/Post";

export async function renderPost(post: Awaited<ReturnType<typeof getPost>>) {
  if (!post) {
    return notFound();
  }
  if (post.type.includes("collection")) {
    return redirect("/notes/" + post.id);
  }


  if (post.type == "page") {
    const { content } = await parseMDX(post);
    return (
      <>
        <section className="container mx-auto px-6">
          <Prose content={content} className="max-w-full py-20" />
        </section>
        {/* 这里只是为了能在 mdx 中动态使用这个  class ... */}
        <div className="lg:grid-cols-4"></div>
        <Footer></Footer>
      </>
    );
  }

  // 获取关联文章
  const posts = await getRelatedPosts(post, { limit: 5 });

  return (
    <>
      {/* @ts-ignore */}
      <Post data={post} relatedPosts={posts} />
      <Footer></Footer>
    </>
  );

}