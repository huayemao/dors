import { getAllCategories } from "@/lib/categories";
import { getPost } from "@/lib/posts";
import { getTags } from "@/lib/tags";
import { notFound } from "next/navigation";
import { PostForm } from "../../../../../components/PostForm";

export default async function page({ params }) {
  if (!params.id || Number.isNaN(parseInt(params.id))) {
    return notFound();
  }

  const post = await getPost(parseInt(params.id as string));

  const categories = await getAllCategories();
  const tags = await getTags();

  if (!post) {
    return notFound();
  }

  return (
    <main className="w-full px-8 py-4">
      <PostForm post={post} categories={categories} tags={tags} />
    </main>
  );
}
