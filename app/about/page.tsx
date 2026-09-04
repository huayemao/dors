import Post from "@/components/Post";
import { getFeaturedPostIds, getPost, getRecentPosts, getRelatedPosts } from "@/lib/server/posts";

export default async function About() {
  const postIds = await getFeaturedPostIds();
  const post = postIds && postIds.length > 0 ? await getPost(postIds[0]) : null;
  const posts = post ? await getRelatedPosts(post) : [];

  if (!post) {
    return (
      <main className="w-full bg-white dark:bg-muted-900 min-h-screen">
        <div className="container mx-auto py-16 px-6 text-center text-muted-600 dark:text-muted-400">
          关于
        </div>
      </main>
    );
  }

  return (
    <main className="w-full bg-white dark:bg-muted-900">
      {/* @ts-ignore */}
      <Post data={post} relatedPosts={posts}></Post>
    </main>
  );
}
