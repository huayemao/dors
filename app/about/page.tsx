import Post from "@/components/Post";
import { getFeaturedPostIds, getPost, getRecentPosts, getRelatedPosts } from "@/lib/server/posts";

export default async function About() {
  const postIds = await getFeaturedPostIds();

  const post = await getPost(postIds[0]);
  const posts = await getRelatedPosts(post);

  return (
    <main className="w-full bg-white dark:bg-muted-900">
      {/* @ts-ignore */}
      <Post data={post} relatedPosts={posts}></Post>
    </main>
  );
}
