import { PostContextProvider } from "@/contexts/post";
import { getPost } from "@/lib/posts";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic'

export default async function page({ params, children }) {
  if (!params.id || Number.isNaN(parseInt(params.id))) {
    return notFound();
  }

  const post = await getPost(parseInt(params.id as string));

  if (!post) {
    return notFound();
  }

  return (
    <main className="w-full md:px-8 py-4">
      <PostContextProvider post={post}>{children}</PostContextProvider>
    </main>
  );
}
