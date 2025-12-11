import { PostContextProvider } from "@/contexts/post";
import { getPost } from "@/lib/server/posts";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic'

export default async function page(props) {
  const params = await props.params;

  const {
    children
  } = props;

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
