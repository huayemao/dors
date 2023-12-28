import { getPost } from "@/lib/posts";
import { notFound } from "next/navigation";
import { PostForm } from "../../../../components/PostForm";

export default async function page({ params }) {
  if (!params.id || Number.isNaN(parseInt(params.id))) {
    return notFound();
  }

  const post = await getPost(parseInt(params.id as string));

  if (!post) {
    return notFound();
  }

  return (
      <PostForm post={post}  />
  );
}
