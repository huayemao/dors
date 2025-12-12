import parseMDX from "@/lib/mdx/parseMDX";
import { getPost, getPostIds, getRelatedPosts, getBookByPostId } from "@/lib/server/posts";
import { notFound, redirect } from "next/navigation";

import Prose from "@/components/Base/Prose";
import { Footer } from "@/components/Footer";
import Post from "@/components/Post";

const isNoteCollection = (str: any) => {
  try {
    if (typeof str != "string") {
      return false;
    }
    const obj = JSON.parse(str);
    if (obj[0].content) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

export async function renderPost(post: Awaited<ReturnType<typeof getPost>>) {
  if (!post) {
    return notFound();
  }
  if (post.type.includes("collection") || isNoteCollection(post.content)) {
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
  
  // 获取所属 book
  const book = await getBookByPostId(post.id);

  return (
    <>
      {/* @ts-ignore */}
      <Post data={post} relatedPosts={posts} book={book} />
      <Footer></Footer>
    </>
  );

}